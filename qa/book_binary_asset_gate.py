#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / 'qa' / 'book-binary-assets-last-report.json'

EXPECTED = [
    {
        'characterId': 'pitpit',
        'path': 'assets/characters/pitpit/master/pitpit_master_00.png',
        'sha256': '50917df75faa5ecd2faf3f35befe58817c6f908f81ca26efca42b99bbbef15df',
        'size': [512, 640],
        'mode': 'RGBA',
        'alphaBounds': [89, 80, 424, 620],
        'visibleBottom': 620,
    },
]


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def inspect(spec: dict) -> dict:
    path = ROOT / spec['path']
    if not path.exists():
        return {'characterId': spec['characterId'], 'path': spec['path'], 'status': 'PENDING_GIT_UPLOAD', 'issues': []}

    issues = []
    actual_hash = digest(path)
    if actual_hash != spec['sha256']:
        issues.append(f"sha256 mismatch: {actual_hash}")

    try:
        image = Image.open(path)
        image.load()
    except Exception as exc:
        return {'characterId': spec['characterId'], 'path': spec['path'], 'status': 'REJECT', 'issues': [f'unreadable PNG: {exc}']}

    if image.format != 'PNG':
        issues.append(f'format {image.format} != PNG')
    if list(image.size) != spec['size']:
        issues.append(f'size {list(image.size)} != {spec["size"]}')
    if image.mode != spec['mode']:
        issues.append(f'mode {image.mode} != {spec["mode"]}')

    if 'A' not in image.getbands():
        issues.append('missing alpha channel')
        bounds = None
    else:
        alpha = image.getchannel('A')
        bounds = alpha.getbbox()
        bounds_list = list(bounds) if bounds else None
        if bounds_list != spec['alphaBounds']:
            issues.append(f'alpha bounds {bounds_list} != {spec["alphaBounds"]}')
        if bounds and bounds[3] != spec['visibleBottom']:
            issues.append(f'visible bottom {bounds[3]} != {spec["visibleBottom"]}')
        pixels = alpha.load()
        corners = [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]
        if any(pixels[x, y] != 0 for x, y in corners):
            issues.append('one or more corners are not transparent')

    return {
        'characterId': spec['characterId'],
        'path': spec['path'],
        'status': 'PASS' if not issues else 'REJECT',
        'sha256': actual_hash,
        'issues': issues,
    }


def main() -> int:
    assets = [inspect(spec) for spec in EXPECTED]
    status = 'REJECT' if any(item['status'] == 'REJECT' for item in assets) else (
        'PASS' if all(item['status'] == 'PASS' for item in assets) else 'PENDING'
    )
    report = {'gate': 'book-binary-asset-promotion', 'status': status, 'assets': assets}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if status == 'REJECT' else 0


if __name__ == '__main__':
    raise SystemExit(main())
