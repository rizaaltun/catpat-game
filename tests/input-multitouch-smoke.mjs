import assert from 'node:assert/strict';

import {Input} from '../src/core/Input.js';

const windowListeners = new Map();
globalThis.addEventListener = (type, handler) => windowListeners.set(type, handler);

class FakeButton {
  constructor(key) {
    this.dataset = {input: key};
    this.listeners = new Map();
    this.active = false;
    this.classList = {toggle: (_name, value) => { this.active = value; }};
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  setPointerCapture() {}

  dispatch(type, pointerId) {
    this.listeners.get(type)?.({pointerId, preventDefault() {}});
  }
}

const buttons = ['left', 'right', 'jump', 'focus', 'interact'].map(key => new FakeButton(key));
const root = {querySelectorAll: () => buttons};
const input = new Input(root);
const byKey = key => buttons.find(button => button.dataset.input === key);

byKey('right').dispatch('pointerdown', 1);
byKey('jump').dispatch('pointerdown', 2);
assert.equal(input.state.right, true);
assert.equal(input.state.jump, true, 'movement and jump must work at the same time');
assert.equal(input.consume('jump'), true);

byKey('right').dispatch('pointerup', 1);
assert.equal(input.state.right, false);
assert.equal(input.state.jump, true, 'releasing movement must not cancel jump touch');

byKey('interact').dispatch('pointerdown', 3);
assert.equal(input.state.interact, true);
assert.equal(input.consume('interact'), true);
byKey('interact').dispatch('pointercancel', 3);
assert.equal(input.state.interact, false);

windowListeners.get('blur')();
assert.equal(Object.values(input.state).some(Boolean), false, 'blur must clear held inputs');

console.log('input multitouch smoke: simultaneous move/jump/interact/reset OK');
