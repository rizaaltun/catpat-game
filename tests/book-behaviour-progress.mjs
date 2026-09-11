import assert from 'node:assert/strict';
import {createBookBehaviourProgress} from '../src/game/BookBehaviourProgress.js';

const branch = createBookBehaviourProgress('branch-game-invitation');
assert.equal(branch.next, 'listen-before-start');
assert.equal(branch.perform('complete-course').accepted, false);
assert.equal(branch.perform('listen-before-start').accepted, true);
assert.equal(branch.perform('complete-course').accepted, true);
assert.equal(branch.perform('polite-response').done, true);

const market = createBookBehaviourProgress('market-queue');
for (const step of ['wait-turn', 'ask-politely', 'thank-cashier']) {
  assert.equal(market.perform(step).accepted, true);
}
assert.equal(market.done, true);

const daisies = createBookBehaviourProgress('pitpit-daisy-garden');
for (const step of ['protect-daisies', 'repair-if-damaged', 'apologize']) {
  assert.equal(daisies.perform(step).accepted, true);
}
assert.equal(daisies.done, true);
assert.equal(daisies.perform('collect-toy').reason, 'mission-complete');

console.log('book-behaviour-progress: PASS');
