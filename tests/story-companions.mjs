import assert from 'node:assert/strict';
import {INTRO, SPEAKERS, DialogueSequence, missionStory, festivalStory} from '../src/story/Story.js';
import {CompanionTrail} from '../src/game/CompanionTrail.js';
import {Game} from '../src/game/Game.js';

assert.equal(INTRO.length, 5);
for (const id of ['apple-garden', 'dark-lanterns', 'lost-toy']) {
  const before = missionStory(id);
  const after = missionStory(id, 'after');
  assert.equal(before.lines.length, 4);
  assert.equal(after.lines.length, 3);
  assert.ok(after.lines.every(line => line.emotion === 'happy'));
  for (const line of [...before.lines, ...after.lines]) assert.ok(SPEAKERS[line.speaker]);
  before.lines[0].text = 'mutation';
  assert.notEqual(missionStory(id).lines[0].text, 'mutation');
}
const sequence = new DialogueSequence(INTRO);
assert.equal(sequence.current.speaker, 'catpat');
for (let i = 0; i < INTRO.length; i++) sequence.advance();
assert.equal(sequence.done, true);
assert.equal(sequence.advance(), null);
assert.throws(() => new DialogueSequence([]));
assert.throws(() => new DialogueSequence([{speaker: 'unknown', text: 'x'}]));
assert.throws(() => missionStory('missing'));
const cast = ['apple-garden', 'dark-lanterns', 'lost-toy'].map((missionId, i) => ({id: String(i), missionId, helped: true}));
assert.equal(festivalStory(cast).lines.length, 5);
assert.equal(festivalStory(cast.map(item => ({...item, helped: false}))).lines.length, 2);

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

// The trail follows a real recorded arc, rather than a straight line over a gap.
const airTrail = new CompanionTrail(50);
player.x = 0; player.feetY = 400; player.grounded = false; player.groundedSurface = null;
airTrail.reset(player); airTrail.recruit(cast[0]);
for (let x = 5; x <= 200; x += 5) { player.x = x; player.feetY = 400 - 110 * Math.sin(x / 200 * Math.PI); airTrail.record(player); }
const airborne = airTrail.poses()[0];
assert.ok(airborne.y < 395 && airborne.y > 290);
assert.equal(airborne.grounded, false);
assert.ok(airTrail.samples.length < 150);

// Pause/resume must never create duplicate requestAnimationFrame loops.
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

// A mission completion event must not corrupt the main-level ending timer.
let requested = null;
Object.assign(game, {finishing: 0, mission: {id: 'lost-toy'}, ui: {showStory: (...args) => { requested = args; }}});
game.handleEvents([{type: 'complete'}]);
assert.equal(game.finishing, 0);
assert.equal(requested[0].lines.length, 3);
assert.equal(typeof requested[1], 'function');
console.log('story/companions: 12 contracts OK (data, pause, queue, recruitment, gaps, moving surfaces, mission completion)');
