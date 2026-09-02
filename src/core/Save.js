const KEY = 'catpat-nezaket-save-v2';
const LEGACY_KEY = 'catpat-nezaket-save-v1';
const MAX_LEVEL_ID = 3;

function clampLevel(value) {
  return Math.max(0, Math.min(MAX_LEVEL_ID, Number.isInteger(value) ? value : 0));
}

export class Save {
  constructor() {
    this.data = {
      version: 2,
      currentLevel: 0,
      unlocked: 0,
      completed: [],
      settings: {music: 70, sfx: 85, reducedMotion: false, touchControls: true},
    };
    this.load();
  }

  load() {
    try {
      const current = JSON.parse(localStorage.getItem(KEY));
      const legacy = current ? null : JSON.parse(localStorage.getItem(LEGACY_KEY));
      const stored = current || legacy;
      if (!stored || ![1, 2].includes(stored.version)) return;

      this.data = {
        ...this.data,
        ...stored,
        version: 2,
        currentLevel: clampLevel(stored.currentLevel),
        unlocked: clampLevel(stored.unlocked),
        completed: Array.isArray(stored.completed)
          ? stored.completed.filter(id => Number.isInteger(id) && id >= 0 && id <= MAX_LEVEL_ID)
          : [],
        settings: {...this.data.settings, ...(stored.settings || {})},
      };

      if (legacy) {
        this.write();
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch {
      // A damaged or foreign save must never block the game from starting.
    }
  }

  write() {
    localStorage.setItem(KEY, JSON.stringify(this.data));
  }

  complete(id) {
    if (!this.data.completed.includes(id)) this.data.completed.push(id);
    this.data.unlocked = Math.max(this.data.unlocked, clampLevel(id + 1));
    this.data.currentLevel = clampLevel(id + 1);
    this.write();
  }
}

