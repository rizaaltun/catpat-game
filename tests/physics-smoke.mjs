import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

import {Player, surfaceYAt} from '../src/game/Player.js';
import {LEVELS, createLevel} from '../src/game/levels.js';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url)));
const manifests = {
  platforms: await readJson('../assets/environments/forest/platforms_v03/platform_manifest.json'),
  decorations: await readJson('../assets/environments/forest/decorations_v02/manifest.json'),
  objects: await readJson('../assets/gameplay/forest/objects_v03/manifest.json'),
  mechanisms: await readJson('../assets/gameplay/forest/mechanisms_v04/manifest.json'),
};
const character = await readJson('../assets/characters/catpat/animation_v03/animation_manifest.json');
const level = createLevel(LEVELS[0], manifests);
const idleInput = {
  state: {left: false, right: false, jump: false, focus: false, interact: false},
  consume: () => false,
};

assert.equal(LEVELS.length, 3, 'the active project must expose exactly three chapters');
assert.deepEqual(LEVELS.map(item => item.id), [0, 1, 2]);
assert.equal(LEVELS.filter(item => item.implemented).length, 1, 'only chapter 1 is playable');
assert.ok(level.platforms.length >= 20, 'spacious V06 level must contain at least 20 terrain platforms');
assert.ok(level.decorations.length >= 14, 'level must contain at least 14 decorations');
assert.ok(level.objects.length >= 12, 'level must contain collectibles, checkpoints and mechanisms');
assert.ok(level.length >= 15000, 'extended level must span at least 15,000 world units');
assert.ok(level.surfaces.length > level.platforms.length, 'curves must expand to line segments');

const spawnPlayer = new Player(level.spawn.x, level.spawn.y, character.collider);
for (let i = 0; i < 180; i += 1) spawnPlayer.update(1 / 60, idleInput, level);
assert.equal(spawnPlayer.grounded, true);
assert.ok(Math.abs(spawnPlayer.feetY - 610) < 0.001, 'spawn feet must meet the first surface');

for (const surface of level.surfaces) {
  const x = (surface.x1 + surface.x2) / 2;
  const expectedY = surfaceYAt(surface, x);
  const player = new Player(x, expectedY - 180, character.collider);
  const isolatedWorld = {surfaces: [surface], speedMultiplier: 1};
  for (let i = 0; i < 120; i += 1) player.update(1 / 60, idleInput, isolatedWorld);
  assert.equal(player.grounded, true, `player did not land on ${surface.owner.id}`);
  assert.equal(player.groundedSurface, surface);
  assert.ok(
    Math.abs(player.feetY - expectedY) < 0.001,
    `feet do not match ${surface.owner.id}: ${player.feetY} vs ${expectedY}`,
  );
}

const seamPlayer = new Player(106, 420, character.collider);
seamPlayer.vy = 280;
const seamWorld = {
  surfaces: [
    {x1: 0, y1: 500, x2: 100, y2: 500, owner: {id: 'seam-left'}},
    {x1: 112, y1: 500, x2: 220, y2: 500, owner: {id: 'seam-right'}},
  ],
  speedMultiplier: 1,
};
for (let i = 0; i < 30 && !seamPlayer.grounded; i += 1) seamPlayer.update(1 / 60, idleInput, seamWorld);
assert.equal(seamPlayer.grounded, true, 'foot-width collision sampling must bridge a narrow visual seam');
assert.equal(seamPlayer.feetY, 500, 'narrow seam support must keep the visible feet on the terrain line');

console.log(`physics smoke: ${level.platforms.length} platforms / ${level.surfaces.length} surfaces OK`);
