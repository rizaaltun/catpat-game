import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

import {LevelRuntime} from '../src/game/LevelRuntime.js';
import {Player} from '../src/game/Player.js';
import {LEVELS, createLevel} from '../src/game/levels.js';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url)));
const manifests = {
  platforms: await readJson('../assets/environments/forest/platforms_v02/platform_manifest.json'),
  decorations: await readJson('../assets/environments/forest/decorations_v02/manifest.json'),
  objects: await readJson('../assets/gameplay/forest/objects_v02/manifest.json'),
  mechanisms: await readJson('../assets/gameplay/forest/mechanisms_v03/manifest.json'),
};
const character = await readJson('../assets/characters/catpat/animation_v02/animation_manifest.json');

const makeWorld = () => {
  const level = createLevel(LEVELS[0], manifests);
  const runtime = new LevelRuntime(level);
  const player = new Player(level.spawn.x, level.spawn.y, character.collider);
  player.grounded = true;
  player.previousFeetY = player.feetY;
  return {level, runtime, player};
};
const input = (state = {}, interact = false) => ({
  state: {left: false, right: false, jump: false, focus: false, interact: false, ...state},
  consume: key => key === 'interact' && interact,
});
const placeOnGround = (player, x, feetY) => {
  player.x = x;
  player.y = feetY - player.h / 2;
  player.previousFeetY = feetY;
  player.grounded = true;
  player.vy = 0;
};

{
  const {runtime, player} = makeWorld();
  const opening = runtime.takeEvents();
  assert.ok(opening.some(event => event.type === 'dialogue' && event.speaker === 'Anne'));
  assert.ok(opening.some(event => event.type === 'progress' && event.total === 3));

  placeOnGround(player, runtime.sign.x, runtime.sign.y);
  player.vx = 300;
  runtime.updateAfterPlayer(1 / 60, player, input({right: true}));
  assert.equal(runtime.signWasTurned, true, 'rush path should turn the sign');
  assert.equal(runtime.sign.state, 'disturbed');
  assert.ok(runtime.takeEvents().some(event => event.type === 'prompt'));

  runtime.updateAfterPlayer(1 / 60, player, input({}, true));
  assert.equal(runtime.signWasRepaired, true, 'interact should repair the sign');
  assert.equal(runtime.sign.rotation, 0);

  for (const ticket of runtime.level.objects.filter(object => object.kind === 'ticket')) {
    player.x = ticket.x;
    player.y = ticket.y;
    runtime.updateAfterPlayer(1 / 60, player, input());
  }
  assert.equal(runtime.tickets, 3);
  assert.ok(runtime.takeEvents().some(event => event.type === 'objective' && event.text.includes('festival')));

  placeOnGround(player, runtime.checkpoint.x, runtime.checkpoint.y);
  runtime.updateAfterPlayer(1 / 60, player, input());
  assert.equal(runtime.checkpoint.active, true);
  assert.equal(runtime.level.respawn.x, runtime.checkpoint.x);

  const gateButton = runtime.buttons.find(button => button.id === 'gate-button');
  const gate = runtime.gates.find(item => item.id === 'festival-gate');
  placeOnGround(player, gateButton.x, gateButton.y);
  runtime.updateAfterPlayer(1 / 60, player, input());
  assert.equal(gateButton.active, true, 'standing on the first button should latch it');
  assert.equal(gate.active, true, 'the first button should activate the gate');
  for (let frame = 0; frame < 90; frame += 1) runtime.updateBeforePlayer(1 / 60, player);
  assert.ok(gate.openAmount > 0.99, 'the gate should lift fully');

  const rhythmButton = runtime.buttons.find(button => button.id === 'rhythm-button');
  const rhythmLift = runtime.level.platforms.find(platform => platform.id === 'rhythm-lift');
  placeOnGround(player, rhythmButton.x, rhythmButton.y);
  runtime.updateAfterPlayer(1 / 60, player, input());
  assert.equal(rhythmButton.active, true, 'the second button should latch it');
  assert.equal(rhythmLift.active, true, 'the second button should activate the rhythm lift');

  player.vx = 300;
  for (let frame = 0; frame < 520 && !runtime.cratePlaced; frame += 1) {
    const crateLeft = runtime.crate.x + (runtime.crate.metadata.solid.bounds[0] - runtime.crate.pivot[0]) * runtime.crate.scale;
    placeOnGround(player, crateLeft - player.w / 2 + 1, runtime.crate.y);
    runtime.updateAfterPlayer(1 / 60, player, input({right: true}));
  }
  assert.equal(runtime.cratePlaced, true, 'crate should activate the bridge weight');
  for (let frame = 0; frame < 90; frame += 1) runtime.updateBeforePlayer(1 / 60, player);
  assert.ok(runtime.bridge.currentOffsetY < 1, 'bridge should reach its raised position');

  placeOnGround(player, runtime.level.goal.x, runtime.level.goal.y);
  runtime.updateAfterPlayer(1 / 60, player, input());
  assert.equal(runtime.completed, true);
  assert.ok(runtime.takeEvents().some(event => event.type === 'complete'));
}

{
  const {runtime, player} = makeWorld();
  runtime.takeEvents();
  placeOnGround(player, runtime.sign.x, runtime.sign.y);
  player.vx = 120;
  runtime.updateAfterPlayer(1 / 60, player, input({right: true, focus: true}));
  assert.equal(runtime.carefulPass, true, 'focused movement should preserve the sign');
  assert.equal(runtime.signWasTurned, false);

  placeOnGround(player, runtime.mud.x, runtime.mud.y);
  runtime.updateBeforePlayer(1 / 60, player);
  assert.equal(runtime.level.speedMultiplier, 0.53, 'mud should slow grounded movement');

  const cloudSurface = runtime.cloud.surfaces[0];
  player.groundedSurface = cloudSurface;
  const playerX = player.x;
  const cloudX = runtime.cloud.x;
  runtime.updateBeforePlayer(0.1, player);
  assert.ok(runtime.cloud.x !== cloudX, 'cloud should move');
  assert.ok(Math.abs((player.x - playerX) - (runtime.cloud.x - cloudX)) < 0.001, 'cloud should carry its rider');

  const vineLift = runtime.level.objects.find(object => object.id === 'vine-lift');
  player.grounded = true;
  player.groundedSurface = vineLift.surfaces[0];
  const liftPlayerY = player.y;
  const liftY = vineLift.y;
  runtime.updateBeforePlayer(0.1, player);
  assert.notEqual(vineLift.y, liftY, 'vine lift should move vertically');
  assert.ok(Math.abs((player.y - liftPlayerY) - (vineLift.y - liftY)) < 0.001, 'vine lift should carry its rider vertically');
}

console.log('level 01 runtime smoke: choices/collect/checkpoints/buttons/gate/crate/cloud/lift/goal OK');
