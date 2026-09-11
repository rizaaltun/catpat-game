import assert from 'node:assert/strict';
import {ProductionGame} from '../src/game/ProductionGame.js';
import {createBookMissionDescriptor} from '../src/game/BookMissionModel.js';

const recruited = [];
const friends = [
  {id: 'friend-maymun', name: 'Maymun', helped: false},
  {id: 'friend-porsuk', name: 'Porsuk', helped: false},
  {id: 'friend-pitpit', name: 'Pıtpıt', helped: false},
];
const context = {
  mission: {bookDescriptor: createBookMissionDescriptor('branch-game-invitation')},
  mainState: {x: 140, y: 220, respawn: {x: 10, y: 20}, cameraX: 75},
  level: {friends, respawn: {x: 0, y: 0}, objective: 'continue'},
  companions: {
    members: recruited,
    recruit(friend) { recruited.push(friend); },
  },
  ui: {
    setCompanions(value) { this.lastCompanions = value; },
    setObjective(value) { this.lastObjective = value; },
    setPrompt(value) { this.lastPrompt = value; },
  },
  player: {x: 0, y: 0, vx: 1, vy: 1, grounded: true, groundedSurface: {}},
  camera: {x: 0, y: 0},
  runtime: {tickets: 0, totalTickets: 3},
  teleportFlash: 0,
  missionRuntime: {},
};

ProductionGame.prototype.exitMission.call(context);

assert.deepEqual(recruited.map(item => item.id), ['friend-maymun', 'friend-porsuk']);
assert.equal(friends[0].helped, true);
assert.equal(friends[1].helped, true);
assert.equal(friends[2].helped, false);
assert.equal(context.player.x, 140);
assert.equal(context.player.y, 220);
assert.equal(context.player.grounded, false);
assert.equal(context.mission, null);
assert.equal(context.missionRuntime, null);
assert.equal(context.mainState, null);
assert.equal(context.ui.lastPrompt, '');

console.log('production-game-contract: PASS');
