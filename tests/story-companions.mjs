import assert from 'node:assert/strict';
import {SPEAKERS, DialogueSequence} from '../src/story/Story.js';
import {bookMissionStory} from '../src/story/BookStory.js';
import {CompanionTrail} from '../src/game/CompanionTrail.js';
import {Game} from '../src/game/Game.js';

for (const id of ['branch-game-invitation', 'market-queue', 'pitpit-daisy-garden']) {
  const before = bookMissionStory(id, 'before');
  const sequence = new DialogueSequence(before.lines);
  assert.ok(SPEAKERS[sequence.current.speaker]);
  while (!sequence.done) sequence.advance();
  assert.equal(sequence.advance(), null);
}
assert.throws(() => new DialogueSequence([]));
assert.throws(() => new DialogueSequence([{speaker: 'unknown', text: 'x'}]));

const cast = [
  {id: 'friend-maymun', characterId: 'maymun', helped: true},
  {id: 'friend-porsuk', characterId: 'porsuk', helped: true},
  {id: 'friend-pitpit', characterId: 'pitpit', helped: true},
];
const surface = {x1: 0, y1: 400, x2: 1000, y2: 400};
const player = {x: 0, feetY: 400, facing: 1, grounded: true, groundedSurface: surface};
const trail = new CompanionTrail(80);
trail.reset(player);
for (const friend of cast) { trail.recruit(friend); trail.recruit(friend); }
assert.equal(trail.members.length, 3, 'recruiting must be idempotent');
for (let x = 4; x <= 400; x += 4) { player.x = x; trail.record(player); }
assert.deepEqual(trail.poses().map(pose => Math.round(pose.x)), [320, 240, 160]);
assert.ok(trail.poses().every(pose => pose.visible && pose.y === 400));
surface.y1 += 75; surface.y2 += 75;
assert.ok(trail.poses().every(pose => pose.y === 475), 'moving platform carries sampled feet');
player.x = 5000; player.feetY = 250;
trail.record(player);
assert.equal(trail.samples.length, 1, 'teleport clears the dangerous diagonal trail');
assert.ok(trail.poses().every(pose => !pose.visible));
assert.equal(trail.members.length, 3, 'respawn must preserve recruited friends');

let queued = 0, canceled = 0, resets = 0;
globalThis.requestAnimationFrame = () => ++queued;
globalThis.cancelAnimationFrame = () => canceled++;
const game = Object.create(Game.prototype);
Object.assign(game, {paused: false, running: true, loopToken: 1, raf: 1, acc: 1, input: {reset: () => resets++}});
game.setPaused(true);
assert.equal(game.acc, 0);
assert.equal(canceled, 1);
game.setPaused(false);
game.setPaused(false);
assert.equal(queued, 1, 'duplicate resume calls must not schedule a second loop');
assert.equal(resets, 2);
const time = game.time;
game.setPaused(true);
game.update(1);
assert.equal(game.time, time, 'paused dialogue freezes the simulation entirely');

console.log('story/companions: canonical dialogue + trail + pause contracts OK');
