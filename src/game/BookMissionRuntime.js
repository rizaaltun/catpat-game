import {createBookBehaviourProgress} from './BookBehaviourProgress.js';
import {getBookMissionBlueprint} from './BookMissionBlueprints.js';

const DEFAULT_RADIUS = 120;

export class BookMissionRuntime {
  constructor(eventId) {
    this.blueprint = getBookMissionBlueprint(eventId);
    this.eventId = eventId;
    this.progress = createBookBehaviourProgress(eventId);
    this.completed = false;
    this.events = [];
    this.lastPrompt = '';
    this.waitTimer = 0;
    this.gardenEntered = false;
    this.gardenExited = false;
    this.daisyDamaged = false;
    this.repairNeeded = false;
    this.emit('objective', {text: this.blueprint.objective});
  }

  update(dt, player, input) {
    if (this.completed) return;
    if (this.eventId === 'branch-game-invitation') this.updateBranchGame(player, input);
    else if (this.eventId === 'market-queue') this.updateMarketQueue(dt, player, input);
    else if (this.eventId === 'pitpit-daisy-garden') this.updateDaisyGarden(player, input);
    else throw new Error(`Unsupported book mission runtime: ${this.eventId}`);
    if (this.progress.done && !this.completed) {
      this.completed = true;
      this.setPrompt('');
      this.emit('complete', {eventId: this.eventId, descriptor: this.blueprint.bookDescriptor});
    }
  }

  updateBranchGame(player, input) {
    const triggers = this.blueprint.behaviourTriggers;
    let prompt = '';
    if (this.progress.next === 'listen-before-start') {
      const point = triggers['listen-before-start'];
      if (near(player, point)) {
        prompt = 'Etkileşim: Önce Maymun ve Porsuk’u dinle';
        if (input.consume('interact')) this.accept('listen-before-start');
      }
    } else if (this.progress.next === 'complete-course') {
      const point = triggers['complete-course'];
      if (near(player, point)) this.accept('complete-course');
    } else if (this.progress.next === 'polite-response') {
      const point = triggers['polite-response'];
      if (near(player, point)) {
        prompt = 'Etkileşim: Nazikçe cevap ver';
        if (input.consume('interact')) this.accept('polite-response');
      }
    }
    this.setPrompt(prompt);
  }

  updateMarketQueue(dt, player, input) {
    const triggers = this.blueprint.behaviourTriggers;
    let prompt = '';
    if (this.progress.next === 'wait-turn') {
      const point = triggers['wait-turn'];
      if (near(player, point)) {
        this.waitTimer += dt;
        const remain = Math.max(0, point.holdSeconds - this.waitTimer);
        prompt = remain > 0 ? `Sıranı bekle: ${remain.toFixed(1)} sn` : '';
        if (this.waitTimer >= point.holdSeconds) this.accept('wait-turn');
      } else {
        this.waitTimer = 0;
        prompt = 'Sıradaki işaretli yerde bekle';
      }
    } else if (this.progress.next === 'ask-politely') {
      const point = triggers['ask-politely'];
      if (near(player, point)) {
        prompt = 'Etkileşim: İsteğini nazikçe söyle';
        if (input.consume('interact')) this.accept('ask-politely');
      }
    } else if (this.progress.next === 'thank-cashier') {
      const point = triggers['thank-cashier'];
      if (near(player, point)) {
        prompt = 'Etkileşim: Teşekkür et';
        if (input.consume('interact')) this.accept('thank-cashier');
      }
    }
    this.setPrompt(prompt);
  }

  updateDaisyGarden(player, input) {
    const triggers = this.blueprint.behaviourTriggers;
    const lane = triggers['protect-daisies'];
    let prompt = '';

    if (this.progress.next === 'protect-daisies') {
      if (player.x >= lane.x1 && player.x <= lane.x2) {
        this.gardenEntered = true;
        if (Math.abs(player.vx) > lane.maxSpeed) {
          if (!this.daisyDamaged) this.emit('daisy-damaged', {speed: Math.abs(player.vx)});
          this.daisyDamaged = true;
          this.repairNeeded = true;
        }
        prompt = this.daisyDamaged ? 'Yavaşla — bir papatya zarar gördü' : 'Papatyaların arasında dikkatlice ilerle';
      }
      if (this.gardenEntered && player.x > lane.x2) {
        this.gardenExited = true;
        this.accept('protect-daisies', {damaged: this.daisyDamaged});
        if (!this.repairNeeded) this.accept('repair-if-damaged', {skippedBecauseUndamaged: true});
      }
    }

    if (this.progress.next === 'repair-if-damaged') {
      const point = triggers['repair-if-damaged'];
      if (near(player, point)) {
        prompt = 'Etkileşim: Zarar gören papatyayı düzelt';
        if (input.consume('interact')) {
          this.repairNeeded = false;
          this.accept('repair-if-damaged', {repaired: true});
          this.emit('daisy-repaired', {});
        }
      } else {
        prompt = 'Geri dön ve zarar gören papatyayı düzelt';
      }
    }

    if (this.progress.next === 'apologize') {
      const point = triggers.apologize;
      if (near(player, point)) {
        prompt = 'Etkileşim: Pıtpıt’tan özür dile';
        if (input.consume('interact')) this.accept('apologize');
      } else if (!prompt) {
        prompt = 'Pıtpıt’a ulaş';
      }
    }
    this.setPrompt(prompt);
  }

  accept(behaviour, metadata = {}) {
    const result = this.progress.perform(behaviour);
    if (!result.accepted) return result;
    this.emit('behaviour', {behaviour, metadata, snapshot: this.progress.snapshot()});
    return result;
  }

  setPrompt(text) {
    if (text === this.lastPrompt) return;
    this.lastPrompt = text;
    this.emit('prompt', {text});
  }

  emit(type, payload) {
    this.events.push({type, ...payload});
  }

  takeEvents() {
    return this.events.splice(0);
  }
}

function near(player, point) {
  const radius = point.radius ?? DEFAULT_RADIUS;
  const feetY = player.feetY ?? player.y;
  const dx = player.x - point.x;
  const dy = feetY - point.y;
  return dx * dx + dy * dy <= radius * radius;
}
