#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / 'qa' / 'book-event-registry.json').read_text(encoding='utf-8'))
TARGETS = [
    ROOT / 'src' / 'story' / 'Story.js',
    ROOT / 'src' / 'game' / 'Mission.js',
    ROOT / 'src' / 'game' / 'levels.js',
]

results = []
blocking = []
for path in TARGETS:
    if not path.exists():
        blocking.append({'severity': 'P0', 'file': str(path.relative_to(ROOT)), 'reason': 'runtime source missing'})
        continue
    text = path.read_text(encoding='utf-8')
    matches = []
    for item in REGISTRY['replacementRequiredLegacyContent']:
        token = item['token']
        count = text.count(token)
        if count:
            match = {'token': token, 'count': count, 'reason': item['reason']}
            matches.append(match)
            blocking.append({'severity': 'P1', 'file': str(path.relative_to(ROOT)), **match})
    results.append({'file': str(path.relative_to(ROOT)), 'matches': matches})

report = {
    'gate': 'book-story-runtime-fidelity',
    'status': 'PASS' if not blocking else 'REPLACEMENT_REQUIRED',
    'migrationTargets': REGISTRY['migrationTargets'],
    'files': results,
    'blocking': blocking,
}
(ROOT / 'qa' / 'book-story-last-report.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8'
)
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(0 if not blocking else 1)
