import assert from 'node:assert/strict';
import {
  PRODUCTION_TRAVERSAL_OBJECTIVE,
  applyProductionCanonLock,
  filterProductionEvents,
  productionFriendRejectionReasons,
} from '../src/game/ProductionCanonLock.js';

const level = {
  objective: 'legacy objective',
  friends: [
    {id: 'friend-porsuk', characterId: 'porsuk', missionId: 'apple-garden', sheetAsset: 'friend_porsuk_sheet.png'},
    {id: 'friend-baykus', characterId: 'baykus', missionId: 'dark-lanterns', sheetAsset: 'friend_baykus_sheet.png'},
    {id: 'friend-civciv', characterId: 'civciv', missionId: 'lost-toy', sheetAsset: 'friend_civciv_sheet.png'},
    {id: 'friend-maymun', characterId: 'maymun', missionId: 'branch-game-invitation', frameAsset: 'maymun_idle_00.png'},
  ],
};

const report = applyProductionCanonLock(level);
assert.deepEqual(level.friends.map(friend => friend.id), ['friend-maymun']);
assert.equal(level.objective, PRODUCTION_TRAVERSAL_OBJECTIVE);
assert.deepEqual(report.activeFriends, ['friend-maymun']);
assert.equal(report.removedFriends.length, 3);
assert.ok(report.removedFriends.every(item => item.reasons.length > 0));

assert.deepEqual(productionFriendRejectionReasons({
  id: 'friend-porsuk', missionId: 'branch-game-invitation', sheetAsset: 'friend_porsuk_sheet.png',
}), ['sprite-sheet-runtime-art']);

const events = [
  {type: 'objective', text: 'safe'},
  {type: 'enter-mission', missionId: 'apple-garden', friendId: 'friend-porsuk'},
  {type: 'enter-book-mission', eventId: 'branch-game-invitation'},
  {type: 'prompt', text: 'safe'},
];
const filtered = filterProductionEvents(events);
assert.deepEqual(filtered.accepted.map(event => event.type), ['objective', 'enter-book-mission', 'prompt']);
assert.equal(filtered.blocked.length, 1);
assert.equal(filtered.blocked[0].reason, 'legacy-mission-entry-disabled');

console.log('production-canon-lock: PASS');
