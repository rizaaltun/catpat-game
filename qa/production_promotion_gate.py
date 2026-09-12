#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'assets' / 'production_v07' / 'manifest.json'
STATUS = ROOT / 'assets' / 'production_v07' / 'book_mission_asset_status.json'
HAZARDS = ROOT / 'qa' / 'hazard-feasibility-v01.json'
REPORT = ROOT / 'qa' / 'production-promotion-last-report.json'

FORBIDDEN_SOURCE_TOKENS = ('sheet', 'board', 'concept')


def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding='utf-8'))


def repo_path(value: str) -> Path:
    path = (ROOT / value).resolve()
    if ROOT.resolve() not in path.parents and path != ROOT.resolve():
        raise ValueError(f'path escapes repository: {value}')
    return path


def collect_frame_paths(value: Any, key: str = '') -> list[str]:
    out: list[str] = []
    if isinstance(value, dict):
        if 'spriteSheets' in value and value['spriteSheets']:
            raise ValueError('spriteSheets key is forbidden in a promoted runtime asset manifest')
        for child_key, child in value.items():
            out.extend(collect_frame_paths(child, child_key))
    elif isinstance(value, list):
        if key.lower() in {'frames', 'assets', 'files'}:
            out.extend(item for item in value if isinstance(item, str))
        else:
            for child in value:
                out.extend(collect_frame_paths(child, key))
    elif isinstance(value, str) and key.lower() in {'frame', 'asset', 'file', 'path'}:
        out.append(value)
    return out


def inspect_png(relative: str, require_transparency: bool = True) -> tuple[str, list[str]]:
    issues: list[str] = []
    lowered = relative.lower()
    if not lowered.endswith('.png'):
        issues.append('runtime art must be PNG')
    if any(token in Path(lowered).name for token in FORBIDDEN_SOURCE_TOKENS):
        issues.append('sprite-sheet/concept/source-board filename is forbidden')
    path = repo_path(relative)
    if not path.exists():
        issues.append('referenced runtime asset is missing from Git')
        return '', issues
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    try:
        image = Image.open(path)
        image.load()
    except Exception as exc:
        issues.append(f'unreadable image: {exc}')
        return digest, issues
    if image.format != 'PNG':
        issues.append(f'image format is {image.format}, expected PNG')
    if 'A' not in image.getbands():
        issues.append('PNG has no alpha channel')
    elif require_transparency:
        alpha = image.getchannel('A')
        extrema = alpha.getextrema()
        if extrema[0] == 255:
            issues.append('asset is fully opaque; transparent runtime module required')
    return digest, issues


def validate_evidence(item_id: str, spec: dict, kind: str) -> list[dict]:
    failures: list[dict] = []
    required = ['assetManifest', 'technicalQa', 'bookFidelityQa', 'mobileVisualQa']
    if kind == 'scene':
        required += ['surfaceContactQa', 'greenOnGreenQa']
    for field in required:
        if not spec.get(field):
            failures.append({'id': item_id, 'field': field, 'reason': 'required promotion evidence missing'})
    if failures:
        return failures

    manifest_path = repo_path(spec['assetManifest'])
    if not manifest_path.exists():
        return [{'id': item_id, 'field': 'assetManifest', 'reason': 'asset manifest missing from Git'}]
    asset_manifest = load(manifest_path)
    try:
        paths = collect_frame_paths(asset_manifest)
    except ValueError as exc:
        return [{'id': item_id, 'field': 'assetManifest', 'reason': str(exc)}]
    if not paths:
        failures.append({'id': item_id, 'field': 'assetManifest', 'reason': 'no individual runtime asset paths found'})
        return failures

    hashes: dict[str, str] = {}
    for relative in paths:
        digest, issues = inspect_png(relative, require_transparency=(kind == 'character' or 'background' not in relative.lower()))
        for issue in issues:
            failures.append({'id': item_id, 'asset': relative, 'reason': issue})
        if digest:
            if digest in hashes:
                failures.append({'id': item_id, 'asset': relative, 'reason': f'duplicate pixels/file bytes match {hashes[digest]}'})
            else:
                hashes[digest] = relative

    for field in required[1:]:
        qa_path = repo_path(spec[field])
        if not qa_path.exists():
            failures.append({'id': item_id, 'field': field, 'reason': 'QA evidence file missing from Git'})
            continue
        qa = load(qa_path)
        if qa.get('status') not in {'PASS', 'pass'}:
            failures.append({'id': item_id, 'field': field, 'reason': f'QA status is not PASS: {qa.get("status")}'})
    return failures


def validate_hazards() -> list[dict]:
    data = load(HAZARDS)
    failures: list[dict] = []
    for hazard in data.get('mandatoryHazards', []):
        required = ['geometry', 'timing', 'feasibilityMargin', 'mobileTolerance', 'unavoidableDamagePass', 'runtimeTest']
        for field in required:
            if field not in hazard or hazard[field] in (None, '', False):
                failures.append({'hazard': hazard.get('id', 'unknown'), 'field': field, 'reason': 'mandatory hazard is unmeasured'})
    return failures


def main() -> int:
    manifest = load(MANIFEST)
    status = load(STATUS)
    failures: list[dict] = []

    policy_checks = {
        'codedFinishedUiAllowed': manifest['visualPolicy'].get('codedFinishedUiAllowed') is False,
        'separateTransparentFrames': manifest['characterPolicy'].get('separateTransparentFrames') is True,
        'greenOnGreenPlayerLaneAllowed': manifest['environmentPolicy'].get('greenOnGreenPlayerLaneAllowed') is False,
        'mandatoryHazardRequiresMeasuredFeasibility': manifest['hazardPolicy'].get('mandatoryHazardRequiresMeasuredFeasibility') is True,
        'legacyBookStoryAuditBlocking': manifest['qa'].get('legacyBookStoryAuditTemporarilyNonBlocking') is False,
    }
    for name, passed in policy_checks.items():
        if not passed:
            failures.append({'policy': name, 'reason': 'production policy is not locked to the required value'})

    checked_ready: list[str] = []
    for kind_key, kind in [('characters', 'character'), ('scenes', 'scene')]:
        for item_id, spec in status.get(kind_key, {}).items():
            if not isinstance(spec.get('runtimeReady'), bool):
                failures.append({'id': item_id, 'reason': 'runtimeReady must be boolean'})
                continue
            if not spec['runtimeReady']:
                if not str(spec.get('reason', '')).strip():
                    failures.append({'id': item_id, 'reason': 'blocked package must state a reason'})
                continue
            checked_ready.append(item_id)
            failures.extend(validate_evidence(item_id, spec, kind))

    failures.extend(validate_hazards())
    report = {
        'gate': 'production-canonical-promotion',
        'status': 'PASS' if not failures else 'REJECT',
        'runtimeReadyChecked': checked_ready,
        'blockedPackages': [
            item_id
            for group in ('characters', 'scenes')
            for item_id, spec in status.get(group, {}).items()
            if not spec.get('runtimeReady')
        ],
        'failures': failures,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not failures else 1


if __name__ == '__main__':
    raise SystemExit(main())
