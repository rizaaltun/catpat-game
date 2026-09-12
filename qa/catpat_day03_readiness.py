#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ANIM_ROOT = ROOT / 'assets/characters/catpat/animation_v03'
MANIFEST = ANIM_ROOT / 'animation_manifest.json'
REPORT = ROOT / 'qa/catpat-day03-last-report.json'
TARGETS = {'idle': 8, 'run': 10}
CANVAS = (512, 640)
GROUND_Y = 620
CENTER = 256.0
CENTER_TOL = 1.0


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inspect(relative: str) -> dict:
    path = ANIM_ROOT / relative
    issues = []
    if path.suffix.lower() != '.png':
        issues.append('not-png')
    if not path.exists():
        return {'file': relative, 'issues': ['missing']}
    image = Image.open(path)
    image.load()
    if image.format != 'PNG': issues.append('not-png-format')
    if image.size != CANVAS: issues.append(f'canvas-{image.size}')
    if image.mode != 'RGBA': issues.append(f'mode-{image.mode}')
    alpha = image.getchannel('A') if 'A' in image.getbands() else None
    bounds = alpha.getbbox() if alpha else None
    if not bounds:
        issues.append('no-visible-pixels')
        center = None
    else:
        if bounds[3] != GROUND_Y: issues.append(f'visible-bottom-{bounds[3]}')
        center = (bounds[0] + bounds[2]) / 2
        if abs(center - CENTER) > CENTER_TOL: issues.append(f'center-drift-{center:.1f}')
        corners = [(0,0),(image.width-1,0),(0,image.height-1),(image.width-1,image.height-1)]
        px = alpha.load()
        if any(px[x,y] != 0 for x,y in corners): issues.append('opaque-corner')
    return {'file': relative, 'sha256': file_hash(path), 'bounds': list(bounds) if bounds else None, 'centerX': center, 'issues': issues}


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    clips = {}
    hard_failures = []
    pending = []
    for clip, target in TARGETS.items():
        frames = manifest.get('clips', {}).get(clip, {}).get('frames', [])
        inspected = [inspect(frame) for frame in frames]
        hashes = [item.get('sha256') for item in inspected if item.get('sha256')]
        unique = len(set(hashes))
        duplicates = len(hashes) - unique
        issues = [f"{item['file']}: {issue}" for item in inspected for issue in item['issues']]
        if issues or duplicates:
            hard_failures.extend(issues)
            if duplicates: hard_failures.append(f'{clip}: {duplicates} duplicate frame file(s)')
        if unique < target:
            pending.append(f'{clip}: {unique}/{target} unique authored frames')
        clips[clip] = {'target': target, 'listed': len(frames), 'unique': unique, 'frames': inspected}

    render_motion = manifest.get('renderMotion', {})
    if any(render_motion.get(key) for key in ('idleBreath','runWeightShift','landingSquash')):
        hard_failures.append('procedural character transform fallback still enabled')

    status = 'REJECT' if hard_failures else ('PENDING' if pending else 'PASS')
    report = {
        'gate': 'catpat-day03-idle-run',
        'status': status,
        'canonicalCanvas': list(CANVAS),
        'groundContactY': GROUND_Y,
        'clips': clips,
        'pending': pending,
        'failures': hard_failures,
        'promotionRule': 'PASS requires 8 unique idle and 10 unique run PNGs with canonical geometry, true alpha, no duplicate files, and no procedural transform animation.'
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if status == 'REJECT' else 0

if __name__ == '__main__':
    raise SystemExit(main())
