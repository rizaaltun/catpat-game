import {assertBookEvent} from '../story/BookCanon.js';

export class BookBehaviourProgress {
  constructor(eventId) {
    const event = assertBookEvent(eventId);
    this.eventId = event.id;
    this.required = [...event.gameplay.requiredBehaviours];
    this.completed = [];
    this.rejected = [];
  }

  get next() {
    return this.required[this.completed.length] ?? null;
  }

  get done() {
    return this.completed.length === this.required.length;
  }

  perform(behaviour) {
    if (this.done) return {accepted: false, reason: 'mission-complete', next: null};
    if (!this.required.includes(behaviour)) {
      this.rejected.push({behaviour, reason: 'not-in-book-event'});
      return {accepted: false, reason: 'not-in-book-event', next: this.next};
    }
    if (behaviour !== this.next) {
      this.rejected.push({behaviour, reason: 'out-of-order'});
      return {accepted: false, reason: 'out-of-order', next: this.next};
    }
    this.completed.push(behaviour);
    return {accepted: true, reason: 'ok', next: this.next, done: this.done};
  }

  snapshot() {
    return {
      eventId: this.eventId,
      required: [...this.required],
      completed: [...this.completed],
      next: this.next,
      done: this.done,
      rejected: this.rejected.map(item => ({...item})),
    };
  }
}

export function createBookBehaviourProgress(eventId) {
  return new BookBehaviourProgress(eventId);
}
