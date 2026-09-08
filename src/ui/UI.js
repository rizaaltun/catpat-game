import {LEVELS} from '../game/levels.js';
import {INTRO, SPEAKERS, DialogueSequence} from '../story/Story.js';

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
    this.story = null;
    this.storyPanel = root.querySelector('#story-dialogue');
    this.storyNext = root.querySelector('#story-next');
    this.storySkip = root.querySelector('#story-skip');
    this.startRequest = 0;
    this.buildLevels();
    this.bind();
  }

  attach(game) {
    this.game = game;
    game.assetsReady.then(() => this.renderMenuArt()).catch(error => this.showError(error));
  }

  bind() {
    this.root.addEventListener('click', event => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      if (action === 'continue') this.startJourney(this.firstPlayableLevel());
      if (action === 'levels') this.show('level-select');
      if (action === 'settings') this.show('settings');
      if (action === 'back' || action === 'menu') this.show('menu');
      if (action === 'pause') this.pause();
      if (action === 'resume') {
        this.root.dataset.playing = 'true';
        this.hideAll();
        this.hud.hidden = false;
        this.game.setPaused(false);
      }
      if (action === 'restart') this.startJourney(this.game.level.id);
      if (action === 'story-next') this.advanceStory();
      if (action === 'story-skip') this.finishStory();
    });
    addEventListener('keydown', event => {
      if (!this.story) return;
      if (['Enter', 'Space', 'KeyE', 'Escape'].includes(event.code)) {
        event.preventDefault(); event.stopImmediatePropagation();
        if (!event.repeat && event.code !== 'Escape') this.advanceStory();
      }
      if (event.code === 'Tab') {
        event.preventDefault();
        const current = document.activeElement;
        (current === this.storyNext ? this.storySkip : this.storyNext).focus();
      }
    }, true);
    this.root.querySelectorAll('[data-setting]').forEach(control => {
      const key = control.dataset.setting;
      const stored = this.save.data.settings[key];
      if (control.type === 'checkbox') control.checked = !!stored;
      else control.value = stored;
      control.addEventListener('change', () => {
        this.save.data.settings[key] = control.type === 'checkbox' ? control.checked : Number(control.value);
        this.save.write();
        this.applySettings();
      });
    });
    this.applySettings();
  }

  applySettings() {
    const settings = this.save.data.settings;
    this.root.classList.toggle('reduce-motion', !!settings.reducedMotion);
    this.root.classList.toggle('hide-touch', !settings.touchControls);
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
      if (card && !card.disabled) this.startJourney(Number(card.dataset.level));
    };
  }

  show(id) {
    this.cancelStory();
    this.startRequest += 1;
    this.root.dataset.playing = 'false';
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
    this.root.dataset.playing = 'true';
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
    if (this.story) return;
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
    if (!this.game?.running || this.story) return;
    this.show('pause');
  }

  async startJourney(id) {
    const request = ++this.startRequest;
    const button = this.root.querySelector('[data-action="continue"]');
    button.disabled = true;
    this.root.querySelector('#loading-status').textContent = '\u00c7antam\u0131z haz\u0131rlan\u0131yor...';
    try {
      await this.game.assetsReady;
      if (request !== this.startRequest) return;
      await this.game.start(id);
      this.showStory({title: 'Birlikte festivale!', lines: INTRO}, null, 'Yola \u00e7\u0131kal\u0131m');
    } catch (error) { this.showError(error); }
    finally { button.disabled = false; }
  }

  showError(error) {
    const status = this.root.querySelector('#loading-status');
    status.textContent = 'Oyun dosyalar\u0131 y\u00fcklenemedi. Sayfay\u0131 yenileyip yeniden dene.';
    status.dataset.error = 'true';
    console.error(error);
  }

  showStory(scene, onComplete = null, lastLabel = 'Devam edelim') {
    this.cancelStory();
    this.hideDialogue();
    this.setPrompt('');
    this.story = new DialogueSequence(scene.lines);
    this.storyCallback = onComplete;
    this.storyLastLabel = lastLabel;
    this.storyWasPaused = this.game.paused;
    this.game.setPaused(true);
    this.game.input.reset();
    this.game.draw();
    this.root.dataset.story = 'true';
    this.storyPanel.hidden = false;
    this.root.querySelector('#story-title').textContent = scene.title;
    this.renderStory();
    this.storyNext.focus();
  }

  renderStory() {
    const current = this.story.current;
    const person = SPEAKERS[current.speaker];
    this.root.querySelector('#story-speaker').textContent = person.name;
    this.root.querySelector('#story-text').textContent = current.text;
    this.root.querySelector('#story-page').textContent = `${this.story.index + 1} / ${this.story.lines.length}`;
    this.storyPanel.style.setProperty('--speaker-color', person.color);
    this.storyNext.textContent = this.story.index === this.story.lines.length - 1 ? this.storyLastLabel : 'Devam';
    const canvas = this.root.querySelector('#story-portrait');
    canvas.setAttribute('aria-label', person.name);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isCatpat = person.portrait === 'catpat';
    const image = isCatpat ? this.game.frames.idle : this.game.friendImages[person.portrait];
    if (!image) return;
    const width = 512, height = isCatpat ? 640 : 512;
    const frame = !isCatpat && current.emotion === 'happy' ? 1 : 0;
    const scale = Math.min(canvas.width / width, canvas.height / height);
    ctx.drawImage(image, frame * width, 0, width, height,
      (canvas.width - width * scale) / 2, canvas.height - height * scale,
      width * scale, height * scale);
  }

  advanceStory() {
    if (!this.story) return;
    this.game.input.reset();
    this.story.advance();
    if (this.story.done) this.finishStory();
    else this.renderStory();
  }

  finishStory() {
    if (!this.story) return;
    const callback = this.storyCallback;
    const wasPaused = this.storyWasPaused;
    this.cancelStory();
    this.game.input.reset();
    callback?.();
    if (!this.story && this.game.running && !wasPaused) this.game.setPaused(false);
    this.game.canvas.focus?.();
  }

  cancelStory() {
    this.story = null;
    this.storyCallback = null;
    this.storyPanel.hidden = true;
    delete this.root.dataset.story;
  }

  setCompanions(friends) {
    const list = this.root.querySelector('#companion-list');
    list.replaceChildren();
    for (const friend of friends) {
      const badge = document.createElement('span');
      badge.className = 'companion-badge';
      badge.textContent = friend.name;
      list.append(badge);
    }
    this.root.querySelector('#companion-progress').textContent = `${friends.length}/3`;
  }

  renderMenuArt() {
    const canvas = this.root.querySelector('#menu-illustration');
    const ctx = canvas.getContext('2d');
    const game = this.game;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(game.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(game.decorationImages['decor_bunting.png'], 90, -35, 410, 200);
    ctx.drawImage(game.platformImages['platform_long.png'], -35, 360, 760, 330);
    const hero = game.frames.celebrate;
    ctx.drawImage(hero, 235, 140, 205, 256);
    for (const [index, key] of ['friend_porsuk_sheet.png', 'friend_baykus_sheet.png', 'friend_civciv_sheet.png'].entries()) {
      const image = game.friendImages[key];
      ctx.drawImage(image, 512, 0, 512, 512, 45 + index * 170, 245, 165, 165);
    }
    this.root.querySelector('#loading-status').textContent = 'Dinle, yard\u0131m et, birlikte yola devam et.';
  }

  complete(level) {
    this.save.complete(level.id);
    this.buildLevels();
    this.root.querySelector('#festival-friends').textContent = this.game.level.friends.filter(friend => friend.helped).map(friend => friend.name).join(' \u00b7 ');
    this.show('festival-complete');
  }
}
