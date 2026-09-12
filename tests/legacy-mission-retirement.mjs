import assert from 'node:assert/strict';
import {createMissionWorld, MissionRuntime} from '../src/game/Mission.js';

assert.throws(() => createMissionWorld(), /Retired mission runtime/);
assert.throws(() => new MissionRuntime(), /Retired mission runtime/);
console.log('legacy mission runtime retirement: PASS');
