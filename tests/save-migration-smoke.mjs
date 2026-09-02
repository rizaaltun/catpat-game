import assert from 'node:assert/strict';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
};

values.set('catpat-nezaket-save-v1', JSON.stringify({
  version: 1,
  currentLevel: 7,
  unlocked: 7,
  completed: [0, 4, 7],
  settings: {music: 25},
}));

const {Save} = await import('../src/core/Save.js');
const save = new Save();

assert.equal(save.data.version, 2);
assert.equal(save.data.currentLevel, 2, 'legacy level index must be clamped to chapter 3');
assert.equal(save.data.unlocked, 2, 'legacy unlock index must be clamped to chapter 3');
assert.deepEqual(save.data.completed, [0], 'removed chapters must not survive migration');
assert.equal(save.data.settings.music, 25);
assert.equal(save.data.settings.sfx, 85, 'missing settings must retain current defaults');
assert.equal(values.has('catpat-nezaket-save-v1'), false, 'legacy save must be removed after migration');
assert.equal(JSON.parse(values.get('catpat-nezaket-save-v2')).version, 2);

save.complete(2);
assert.equal(save.data.currentLevel, 2, 'completion must never recreate a fourth chapter');
assert.equal(save.data.unlocked, 2);

console.log('save migration smoke: v1 -> v2 / three-chapter clamp OK');
