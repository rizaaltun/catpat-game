import assert from 'node:assert/strict';
import {BOOK_SPEAKERS, bookMissionStory, bookRepairStory} from '../src/story/BookStory.js';

for (const eventId of ['branch-game-invitation', 'market-queue', 'pitpit-daisy-garden']) {
  const before = bookMissionStory(eventId, 'before');
  const after = bookMissionStory(eventId, 'after');
  assert.ok(before.lines.length > 0);
  assert.ok(after.lines.length > 0);
  for (const line of [...before.lines, ...after.lines]) assert.ok(BOOK_SPEAKERS[line.speaker]);
}

const repair = bookRepairStory('pitpit-daisy-garden');
assert.ok(repair.lines.some(line => line.speaker === 'catpat'));
assert.ok(repair.lines.some(line => line.speaker === 'pitpit'));

const source = JSON.stringify({BOOK_SPEAKERS, repair});
assert.equal(source.includes('Baykuş'), false);
assert.equal(source.includes('Civciv'), false);

console.log('book-story-contract: PASS');
