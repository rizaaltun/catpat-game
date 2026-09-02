import {LEVELS} from '../game/levels.js';

export class UI {
  constructor(root, save) {
    this.root = root;
    this.save = save;
    this.game = null;
    this.screens = [...root.querySelectorAll('.screen')];
    this.hud = root.querySelector('#hud');
    this.objective = root.querySelector('#objective');
    this.progress = root.querySelector('#ticket-count');
    this.prompt = root.querySelector('#interaction-prompt');
    this.dialogue = root.querySelector('#dialogue');
    this.speaker = root.querySelector('#speaker');
    this.dialogueText = root.querySelector('#dialogue-text');
    this.dialogueTimer = 0;
    this.buildLevels();
    this.bind();
  }

  attach(game) {
    this.game = game;
  }

  bind() {
    this.root.addEventListener('click', event => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      if (action === 'continue') this.game.start(this.firstPlayableLevel());
      if (action === 'levels') this.show('level-select');
      if (action === 'settings') this.show('settings');
      if (action === 'back' || action === 'menu') this.show('menu');
      if (action === 'pause') this.pause();
      if (action === 'resume') {
        this.hideAll();
        this.hud.hidden = false;
        this.game.setPaused(false);
      }
      if (action === 'restart') this.game.start(this.game.level.id);
    });
  }

  firstPlayableLevel() {
    const requested = this.save.data.currentLevel;
    return LEVELS[requested]?.implemented ? requested : 0;
  }

  buildLevels() {
    const grid = this.root.querySelector('#level-grid');
    grid.innerHTML = LEVELS.map(level => {
      const locked = level.id > this.save.data.unlocked || !level.implemented;
      return `<button class="level-card" data-level="${level.id}" ${locked ? 'disabled' : ''}>
        <span class="level-number">BÖLÜM ${String(level.id + 1).padStart(2, '0')}</span>
        <strong>${level.title}</strong>
        <small>${level.implemented ? level.subtitle : 'Yapım aşamasında'}</small>
      </button>`;
    }).join('');
    grid.onclick = event => {
      const card = event.target.closest('[data-level]');
      if (card && !card.disabled) this.game.start(Number(card.dataset.level));
    };
  }

  show(id) {
    this.game?.setPaused(true);
    this.hud.hidden = true;
    this.setPrompt('');
    this.hideDialogue();
    this.screens.forEach(screen => screen.classList.toggle('is-visible', screen.id === id));
  }

  hideAll() {
    this.screens.forEach(screen => screen.classList.remove('is-visible'));
  }

  showGame(level) {
    this.hideAll();
    this.hud.hidden = false;
    this.setObjective(level.objective);
    this.setProgress(0, 3);
    this.setPrompt('');
    this.hideDialogue();
  }

  setObjective(text) {
    this.objective.textContent = text;
  }

  setProgress(current, total) {
    this.progress.textContent = `${current}/${total}`;
  }

  setPrompt(text) {
    this.prompt.textContent = text;
    this.prompt.hidden = !text;
  }

  showDialogue(speaker, text, duration = 3200) {
    clearTimeout(this.dialogueTimer);
    this.speaker.textContent = speaker;
    this.dialogueText.textContent = text;
    this.dialogue.hidden = false;
    this.dialogueTimer = setTimeout(() => this.hideDialogue(), duration);
  }

  hideDialogue() {
    clearTimeout(this.dialogueTimer);
    this.dialogue.hidden = true;
  }

  pulseProgress() {
    const badge = this.progress.closest('.hud-progress');
    badge.classList.remove('is-pulsing');
    requestAnimationFrame(() => badge.classList.add('is-pulsing'));
  }

  pause() {
    if (!this.game?.running) return;
    this.game.paused = true;
    this.show('pause');
  }

  complete(level) {
    this.save.complete(level.id);
    this.buildLevels();
    this.show('level-select');
  }
}
