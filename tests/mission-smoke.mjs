import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

import {Player} from '../src/game/Player.js';
import {LevelRuntime} from '../src/game/LevelRuntime.js';
import {LEVELS, createLevel} from '../src/game/levels.js';
import {createMissionWorld, MissionRuntime, SEED_GROW_SECONDS} from '../src/game/Mission.js';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url)));
const manifests = {
  platforms: await readJson('../assets/environments/forest/platforms_v03/platform_manifest.json'),
  decorations: await readJson('../assets/environments/forest/decorations_v02/manifest.json'),
  objects: await readJson('../assets/gameplay/forest/objects_v03/manifest.json'),
  mechanisms: await readJson('../assets/gameplay/forest/mechanisms_v04/manifest.json'),
};
const character = await readJson('../assets/characters/catpat/animation_v03/animation_manifest.json');

const level = createLevel(LEVELS[0], manifests);
assert.equal(level.friends.length, 3, 'the main path must offer exactly three friends to help');
for (const friend of level.friends) {
  assert.ok(friend.name && friend.missionId, `friend ${friend.id} is missing name/missionId`);
}

// Main-path interaction: standing near a friend and pressing interact must
// emit an enter-mission event, never block progress if ignored.
{
  const runtime = new LevelRuntime(level);
  runtime.takeEvents();
  const friend = level.friends[0];
  const player = new Player(friend.x, friend.y - character.collider.height / 2, character.collider);
  player.previousFeetY = player.feetY;
  const noInteract = {state: {left: false, right: false, jump: false, focus: false, interact: false}, consume: () => false};
  const prompt = runtime.resolveFriends(player, noInteract);
  assert.ok(prompt.includes(friend.name), 'standing near an unhelped friend must show a help prompt');

  let consumed = false;
  const withInteract = {state: {...noInteract.state, interact: true}, consume: key => key === 'interact' && !consumed && (consumed = true)};
  runtime.resolveFriends(player, withInteract);
  const events = runtime.takeEvents();
  assert.ok(
    events.some(event => event.type === 'enter-mission' && event.missionId === friend.missionId && event.friendId === friend.id),
    'interacting with a friend must emit enter-mission',
  );
}

const idle = {state: {left: false, right: false, jump: false, focus: false, interact: false}, consume: () => false};
const makeInteract = () => {
  let armed = true;
  return {state: {left: false, right: false, jump: false, focus: false, interact: true}, consume: key => key === 'interact' && armed && !(armed = false)};
};

// apple-garden: pick up the seed, plant it, wait for it to grow, collect all
// apples, and deliver them to the basket.
{
  const friend = level.friends.find(item => item.missionId === 'apple-garden');
  const mission = createMissionWorld('apple-garden', manifests);
  const runtime = new MissionRuntime(mission, friend);
  runtime.takeEvents();
  const player = new Player(mission.spawn.x, mission.spawn.y, character.collider);
  player.grounded = true;

  player.x = mission.props.seed.x;
  player.y = mission.props.seed.y - character.collider.height / 2;
  runtime.update(1 / 60, player, idle);
  assert.equal(runtime.hasSeed, true, 'walking over the seed must pick it up');

  player.x = mission.props.plot.x;
  player.y = mission.props.plot.y - character.collider.height / 2;
  runtime.update(1 / 60, player, makeInteract());
  assert.equal(runtime.planted, true, 'interacting at the plot must plant the seed');

  for (let frame = 0; frame < Math.ceil(SEED_GROW_SECONDS * 60) + 5 && !runtime.grown; frame += 1) {
    runtime.update(1 / 60, player, idle);
  }
  assert.equal(runtime.grown, true, 'the seed must grow into apples after waiting');
  const apples = mission.objects.filter(item => item.kind === 'apple-prop');
  assert.equal(apples.length, 4, 'the apple tree must offer four apples');
  assert.ok(apples.every(apple => apple.visible), 'apples must become visible once grown');

  for (const apple of apples) {
    player.x = apple.x;
    player.y = apple.y - character.collider.height / 2;
    runtime.update(1 / 60, player, idle);
  }
  assert.equal(runtime.appleCount, 4, 'walking over each apple must collect it');

  player.x = mission.props.basket.x;
  player.y = mission.props.basket.y - character.collider.height / 2;
  runtime.update(1 / 60, player, makeInteract());
  assert.equal(runtime.completed, true, 'delivering the apples to the basket must complete the mission');
  assert.ok(runtime.takeEvents().some(event => event.type === 'complete'));
}

// dark-lanterns: lighting every lantern completes the mission automatically.
{
  const friend = level.friends.find(item => item.missionId === 'dark-lanterns');
  const mission = createMissionWorld('dark-lanterns', manifests);
  const runtime = new MissionRuntime(mission, friend);
  runtime.takeEvents();
  const player = new Player(mission.spawn.x, mission.spawn.y, character.collider);
  player.grounded = true;

  for (const lantern of mission.objects) {
    player.x = lantern.x;
    player.y = lantern.y - character.collider.height / 2;
    runtime.update(1 / 60, player, makeInteract());
  }
  assert.ok(mission.objects.every(item => item.lit), 'every lantern must be lit');
  assert.equal(runtime.completed, true, 'lighting all lanterns must complete the mission');
}

// lost-toy: picking up the toy completes the mission without an interact press.
{
  const friend = level.friends.find(item => item.missionId === 'lost-toy');
  const mission = createMissionWorld('lost-toy', manifests);
  const runtime = new MissionRuntime(mission, friend);
  runtime.takeEvents();
  const player = new Player(mission.spawn.x, mission.spawn.y, character.collider);
  player.grounded = true;

  const toy = mission.objects[0];
  player.x = toy.x;
  player.y = toy.y - character.collider.height / 2;
  runtime.update(1 / 60, player, idle);
  assert.equal(toy.collected, true, 'walking over the toy must collect it');
  assert.equal(runtime.completed, true, 'finding the toy must complete the mission');
}

// The ending dialogue should reflect how many friends were helped.
{
  const helpedLevel = createLevel(LEVELS[0], manifests);
  const runtime = new LevelRuntime(helpedLevel);
  runtime.takeEvents();
  for (const friend of helpedLevel.friends) friend.helped = true;
  for (const ticket of helpedLevel.objects.filter(item => item.kind === 'ticket')) {
    const player = new Player(ticket.x, ticket.y, character.collider);
    player.previousFeetY = player.feetY;
    runtime.updateAfterPlayer(1 / 60, player, idle);
  }
  const player = new Player(helpedLevel.goal.x, helpedLevel.goal.y - character.collider.height / 2, character.collider);
  player.previousFeetY = player.feetY;
  player.grounded = true;
  runtime.updateAfterPlayer(1 / 60, player, idle);
  const events = runtime.takeEvents();
  const ending = events.find(event => event.type === 'dialogue' && event.speaker === 'Anne');
  assert.ok(ending?.text.includes('üç dostuna'), 'helping all three friends must change the ending dialogue');
}

console.log('mission smoke: prompt/enter-mission + apple-garden + dark-lanterns + lost-toy + ending variation OK');
