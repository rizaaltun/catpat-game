import assert from 'node:assert/strict';
import {bookMissionRuntimeReady, getBookMissionBlueprint} from '../src/game/BookMissionBlueprints.js';

const branch = getBookMissionBlueprint('branch-game-invitation');
assert.equal(branch.kind, 'branch-course');
assert.deepEqual(branch.recruits, ['maymun', 'porsuk']);
assert.deepEqual(Object.keys(branch.behaviourTriggers), ['listen-before-start', 'complete-course', 'polite-response']);
assert.equal(bookMissionRuntimeReady(branch.id ?? 'branch-game-invitation', ['porsuk']).ready, false);
assert.deepEqual(bookMissionRuntimeReady('branch-game-invitation', ['porsuk']).missing, ['maymun']);
assert.equal(bookMissionRuntimeReady('branch-game-invitation', ['maymun', 'porsuk']).ready, true);

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

console.log('book-mission-blueprints: PASS');
