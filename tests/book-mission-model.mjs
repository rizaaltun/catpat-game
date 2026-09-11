import assert from 'node:assert/strict';
import {createBookMissionDescriptor, markMissionRecruitsHelped} from '../src/game/BookMissionModel.js';

const friends = [
  {id: 'friend-maymun', helped: false},
  {id: 'friend-porsuk', helped: false},
  {id: 'friend-pitpit', helped: false},
];

const branch = createBookMissionDescriptor('branch-game-invitation');
assert.deepEqual(branch.recruitIds, ['maymun', 'porsuk']);
assert.equal(markMissionRecruitsHelped(friends, branch).length, 2);
assert.equal(friends[0].helped, true);
assert.equal(friends[1].helped, true);
assert.equal(friends[2].helped, false);

const market = createBookMissionDescriptor('market-queue');
assert.deepEqual(market.recruitIds, []);
assert.deepEqual(markMissionRecruitsHelped(friends, market), []);

const daisies = createBookMissionDescriptor('pitpit-daisy-garden');
assert.deepEqual(daisies.recruitIds, ['pitpit']);
assert.equal(markMissionRecruitsHelped(friends, daisies).length, 1);
assert.equal(friends[2].helped, true);

console.log('book-mission-model: PASS');
