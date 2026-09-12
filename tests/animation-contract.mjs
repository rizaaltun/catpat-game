import assert from 'node:assert/strict';

import {crateFrameIndex, mushroomFrameIndex, selectSpriteFrame} from '../src/game/Game.js';
import {Player} from '../src/game/Player.js';

globalThis.addEventListener = () => {};

// Sprite-sheet sequences (legacy environment/gameplay objects):
// crate:    idle, push-left, push-right, push-left-small, settle, idle-recover
// mushroom: idle, anticipate, compress, release, recover, idle

const idleCrate = {kind: 'crate', animationState: 'idle', animationTime: 0, wobble: 0};
assert.equal(selectSpriteFrame(idleCrate, 0), 0, 'idle crate must render the idle frame');

const pushRight = {kind: 'crate', animationState: 'push', animationTime: 0.03, wobble: 1};
assert.equal(crateFrameIndex(pushRight), 2, 'pushing right must render the push-right frame');

const pushLeft = {kind: 'crate', animationState: 'push', animationTime: 0.03, wobble: -1};
assert.ok([1, 3].includes(crateFrameIndex(pushLeft)), 'pushing left must alternate the two push-left frames');

const settlingCrate = {kind: 'crate', animationState: 'settle', animationTime: 0.05, wobble: 1};
assert.equal(crateFrameIndex(settlingCrate), 4, 'the settle impact must render the settle frame');
settlingCrate.animationTime = 0.4;
assert.equal(crateFrameIndex(settlingCrate), 5, 'settle must recover into the idle-recover frame');

const mushroom = {kind: 'mushroom', animationState: 'launch', animationTime: 0.04};
assert.equal(mushroomFrameIndex(mushroom, 0), 1, 'the launch must start on the anticipate frame');
mushroom.animationTime = 0.12;
assert.equal(mushroomFrameIndex(mushroom, 0), 2, 'mid-launch must render the compress frame');
mushroom.animationTime = 0.2;
assert.equal(mushroomFrameIndex(mushroom, 0), 3, 'the release must render the release frame');
mushroom.animationTime = 0.35;
assert.equal(mushroomFrameIndex(mushroom, 0), 4, 'the recovery must render the recover frame');
mushroom.animationTime = 0.5;
assert.equal(mushroomFrameIndex(mushroom, 0), 0, 'the mushroom must settle back to idle after recovering');

const idleMushroom = {kind: 'mushroom', animationState: 'idle', animationTime: 0};
assert.ok([0, 5].includes(mushroomFrameIndex(idleMushroom, 0)), 'idle mushroom must breathe between its two idle frames');

const player = new Player(0, 0, {width: 68, height: 102});
for (const state of ['idle', 'run', 'walk', 'land', 'jump', 'fall']) {
  player.state = state;
  player.animTime = 0.4;
  assert.deepEqual(
    player.renderMotion(),
    {scaleX: 1, scaleY: 1, y: 0, rotation: 0},
    `${state} must never fake authored character motion with runtime transforms`,
  );
}

console.log('animation contract: authored character motion only; no procedural Catpat transforms OK');
