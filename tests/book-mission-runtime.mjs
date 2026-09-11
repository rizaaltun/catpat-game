import assert from 'node:assert/strict';
import {BookMissionRuntime} from '../src/game/BookMissionRuntime.js';

const input = () => ({
  used: false,
  consume(action) {
    if (action !== 'interact' || this.used) return false;
    this.used = true;
    return true;
  },
});

// Branch game: cannot finish before listening; then course; then polite answer.
const branch = new BookMissionRuntime('branch-game-invitation');
let player = {x: 310, y: 500, feetY: 540, vx: 0};
branch.update(0.016, player, input());
assert.equal(branch.progress.next, 'complete-course');
player = {x: 2050, y: 480, feetY: 520, vx: 100};
branch.update(0.016, player, input());
assert.equal(branch.progress.next, 'polite-response');
player = {x: 2360, y: 480, feetY: 520, vx: 0};
branch.update(0.016, player, input());
assert.equal(branch.completed, true);

// Market: leaving the wait point resets patience timer; no friend recruit is involved.
const market = new BookMissionRuntime('market-queue');
player = {x: 760, y: 520, feetY: 560, vx: 0};
market.update(1.0, player, input());
assert.equal(market.progress.next, 'wait-turn');
market.update(1.05, player, input());
assert.equal(market.progress.next, 'ask-politely');
player = {x: 1500, y: 520, feetY: 560, vx: 0};
market.update(0.016, player, input());
assert.equal(market.progress.next, 'thank-cashier');
player = {x: 1810, y: 520, feetY: 560, vx: 0};
market.update(0.016, player, input());
assert.equal(market.completed, true);

// Daisy route: rushing damages flowers and forces repair before apology.
const daisies = new BookMissionRuntime('pitpit-daisy-garden');
player = {x: 900, y: 510, feetY: 550, vx: 260};
daisies.update(0.016, player, input());
assert.equal(daisies.daisyDamaged, true);
player = {x: 2010, y: 510, feetY: 550, vx: 80};
daisies.update(0.016, player, input());
assert.equal(daisies.progress.next, 'repair-if-damaged');
assert.equal(daisies.completed, false);
player = {x: 1960, y: 510, feetY: 550, vx: 0};
daisies.update(0.016, player, input());
assert.equal(daisies.progress.next, 'apologize');
player = {x: 2310, y: 500, feetY: 540, vx: 0};
daisies.update(0.016, player, input());
assert.equal(daisies.completed, true);

// Careful daisy traversal skips repair interaction but still requires apology.
const careful = new BookMissionRuntime('pitpit-daisy-garden');
player = {x: 900, y: 510, feetY: 550, vx: 120};
careful.update(0.016, player, input());
player = {x: 2010, y: 510, feetY: 550, vx: 120};
careful.update(0.016, player, input());
assert.equal(careful.daisyDamaged, false);
assert.equal(careful.progress.next, 'apologize');
assert.equal(careful.completed, false);

console.log('book-mission-runtime: PASS');
