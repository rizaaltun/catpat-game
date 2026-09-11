import assert from 'node:assert/strict';
import {bookMissionRuntimeReady, createBookMissionWorld, getBookMissionBlueprint} from '../src/game/BookMissionBlueprints.js';

const branch = getBookMissionBlueprint('branch-game-invitation');
assert.equal(branch.id, 'branch-game-invitation');
assert.equal(branch.kind, 'branch-course');
assert.deepEqual(branch.recruits, ['maymun', 'porsuk']);
assert.deepEqual(Object.keys(branch.behaviourTriggers), ['listen-before-start', 'complete-course', 'polite-response']);
assert.equal(bookMissionRuntimeReady(branch.id, ['porsuk']).ready, false);
assert.deepEqual(bookMissionRuntimeReady(branch.id, ['porsuk']).missing, ['maymun']);
assert.equal(bookMissionRuntimeReady(branch.id, ['maymun', 'porsuk']).ready, true);

const market = getBookMissionBlueprint('market-queue');
assert.deepEqual(market.recruits, []);
assert.equal(bookMissionRuntimeReady('market-queue', []).ready, false);
assert.equal(bookMissionRuntimeReady('market-queue', ['market_cashier']).ready, true);

const daisies = getBookMissionBlueprint('pitpit-daisy-garden');
assert.deepEqual(daisies.recruits, ['pitpit']);
assert.equal(bookMissionRuntimeReady('pitpit-daisy-garden', ['pitpit']).ready, true);
assert.equal(daisies.behaviourTriggers['protect-daisies'].maxSpeed, 185);

for (const blueprint of [branch, market, daisies]) {
  assert.ok(blueprint.platforms.length >= 3);
  assert.ok(blueprint.bookDescriptor.bookEvidence.length > 0);
}

assert.throws(
  () => createBookMissionWorld(branch.id, {platforms: {assets: {}}}, ['porsuk']),
  /art gate blocked.*maymun/,
);

const platformManifest = {assets: {
  'platform_short.png': {walkable: [[10, 20], [210, 20]]},
  'platform_medium.png': {walkable: [[10, 20], [410, 20]]},
  'platform_long.png': {walkable: [[10, 20], [610, 20]]},
}};
const world = createBookMissionWorld(branch.id, {platforms: platformManifest}, ['maymun', 'porsuk']);
assert.equal(world.type, 'book-mission');
assert.equal(world.id, branch.id);
assert.equal(world.platforms.length, 5);
assert.equal(world.surfaces.length, 5);
assert.deepEqual(world.bookDescriptor.recruitIds, ['maymun', 'porsuk']);

console.log('book-mission-blueprints: PASS');
