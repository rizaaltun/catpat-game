import assert from 'node:assert/strict';
import {createProductionBookMissionWorld, productionBookMissionReady} from '../src/game/BookMissionArtGate.js';

let gate = productionBookMissionReady('branch-game-invitation', ['maymun', 'porsuk'], []);
assert.equal(gate.ready, false);
assert.deepEqual(gate.missingCharacters, []);
assert.deepEqual(gate.missingScenes, ['branch_course_scene']);

gate = productionBookMissionReady('pitpit-daisy-garden', ['pitpit'], []);
assert.equal(gate.ready, false);
assert.deepEqual(gate.missingScenes, ['daisy_garden_scene']);

gate = productionBookMissionReady('market-queue', ['market_cashier'], ['market_queue_scene']);
assert.equal(gate.ready, true);

const manifest = {assets: {
  'platform_short.png': {walkable: [[10, 20], [210, 20]]},
  'platform_medium.png': {walkable: [[10, 20], [410, 20]]},
  'platform_long.png': {walkable: [[10, 20], [610, 20]]},
}};

assert.throws(
  () => createProductionBookMissionWorld('pitpit-daisy-garden', {platforms: manifest}, ['pitpit'], []),
  /daisy_garden_scene/,
);

const world = createProductionBookMissionWorld(
  'pitpit-daisy-garden',
  {platforms: manifest},
  ['pitpit'],
  ['daisy_garden_scene'],
);
assert.equal(world.id, 'pitpit-daisy-garden');
assert.deepEqual(world.requiredSceneAssets, ['daisy_garden_scene']);

console.log('book-mission-art-gate: PASS');
