#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

import {LEVELS, createLevel} from '../src/game/levels.js';

const toolsDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(toolsDir, '..');
const readJson = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const manifests = {
  platforms: await readJson('assets/environments/forest/platforms_v02/platform_manifest.json'),
  decorations: await readJson('assets/environments/forest/decorations_v02/manifest.json'),
  objects: await readJson('assets/gameplay/forest/objects_v02/manifest.json'),
  mechanisms: await readJson('assets/gameplay/forest/mechanisms_v03/manifest.json'),
};
const level = createLevel(LEVELS[0], manifests);
const output = resolve(process.argv[2] || resolve(root, 'qa-level01-layout.json'));
const contract = {
  length: level.length,
  platforms: level.platforms.map(({id, asset, x, y, baseY, scale, mechanism}) =>
    ({id, asset, x, y, baseY, scale, mechanism})),
  decorations: level.decorations.map(({id, asset, x, y, scale, pivot, layer, rotation}) =>
    ({id, asset, x, y, scale, pivot, layer, rotation})),
  objects: level.objects.map(({id, asset, kind, x, y, baseX, baseY, scale, pivot}) =>
    ({id, asset, kind, x, y, baseX, baseY, scale, pivot})),
};
await writeFile(output, `${JSON.stringify(contract, null, 2)}\n`);
console.log(`level 01 layout: ${contract.platforms.length} platforms / ${contract.decorations.length} decorations / ${contract.objects.length} objects`);
