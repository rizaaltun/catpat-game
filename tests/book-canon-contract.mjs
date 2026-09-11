import assert from 'node:assert/strict';
import {BOOK_CAST, BOOK_EVENTS, CHAPTER_ONE_BOOK_PLAN, assertBookCharacter, assertBookEvent} from '../src/story/BookCanon.js';

assert.deepEqual(Object.keys(BOOK_CAST).sort(), ['catpat', 'market_cashier', 'maymun', 'pitpit', 'porsuk']);
assert.equal(CHAPTER_ONE_BOOK_PLAN.length, 4);

for (const event of CHAPTER_ONE_BOOK_PLAN) {
  assert.ok(event.evidence.length > 0, `${event.id} needs book evidence`);
  assert.ok(event.gameplay.requiredBehaviours.length > 0, `${event.id} needs gameplay behaviours`);
  assert.equal(assertBookEvent(event.id), event);
  for (const character of event.cast) assert.equal(assertBookCharacter(character), BOOK_CAST[character]);
}

assert.deepEqual(BOOK_EVENTS.branchGame.gameplay.recruits.sort(), ['maymun', 'porsuk']);
assert.deepEqual(BOOK_EVENTS.daisyGarden.gameplay.recruits, ['pitpit']);
assert.deepEqual(BOOK_EVENTS.marketQueue.gameplay.recruits, []);
assert.throws(() => assertBookCharacter('baykus'), /not verified/);
assert.throws(() => assertBookCharacter('civciv'), /not verified/);
assert.throws(() => assertBookEvent('lost-toy'), /not verified/);

console.log('book canon contract: PASS');
