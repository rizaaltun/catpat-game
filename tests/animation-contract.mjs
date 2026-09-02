import assert from 'node:assert/strict';

import {objectRenderMotion} from '../src/game/Game.js';
import {Player} from '../src/game/Player.js';

globalThis.addEventListener = () => {};

const mushroom = {kind: 'mushroom', animationState: 'launch', animationTime: 0.04};
const compressed = objectRenderMotion(mushroom, 0);
assert.ok(compressed.scaleY < 0.7, 'mushroom compression must be clearly visible');
assert.ok(compressed.scaleX > 1.1, 'mushroom cap must spread during compression');

mushroom.animationTime = 0.12;
const released = objectRenderMotion(mushroom, 0);
assert.ok(released.scaleY > 1.1, 'mushroom release must stretch upward');

const crate = {kind: 'crate', animationState: 'push', animationTime: 0.06, wobble: 1};
const pushed = objectRenderMotion(crate, 0);
assert.notEqual(pushed.rotation, 0, 'crate must visibly wobble while pushed');

const player = new Player(0, 0, {width: 68, height: 102});
player.state = 'idle';
player.animTime = 0.4;
assert.notDeepEqual(player.renderMotion(), {scaleX: 1, scaleY: 1, y: 0, rotation: 0});
player.state = 'land';
player.animTime = 0.02;
assert.ok(player.renderMotion().scaleY < 1, 'landing frame must squash without moving the feet pivot');

console.log('animation contract: character/crate/mushroom motion states OK');
