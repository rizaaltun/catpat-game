import assert from 'node:assert/strict';
import {applyProductionCanonLock, filterProductionEvents} from '../src/game/ProductionCanonLock.js';

const level = {
  objective: 'keep',
  friends: [],
  zones: [{id: 'legacy-zone', speaker: 'Orman', text: 'invented traversal narration'}],
};
const report = applyProductionCanonLock(level);
assert.deepEqual(level.zones, [], 'production canon lock must disable non-book traversal narrative zones');
assert.equal(report.removedNarrativeZones, 1);

const filtered = filterProductionEvents([
  {type: 'dialogue', speaker: 'Anne', text: 'invented'},
  {type: 'dialogue', speaker: 'Çatpat', text: 'invented mechanical narration'},
  {type: 'objective', text: 'neutral gameplay objective'},
  {type: 'enter-book-mission', eventId: 'branch-game-invitation'},
]);
assert.deepEqual(filtered.accepted.map(event => event.type), ['objective', 'enter-book-mission']);
assert.equal(filtered.blocked.length, 2);
assert.ok(filtered.blocked.every(item => item.reason === 'non-book-traversal-dialogue-disabled'));
console.log('runtime narrative canon: PASS');
