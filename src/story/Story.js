import {BOOK_EVENTS} from './BookCanon.js';
import {BOOK_SPEAKERS, bookMissionStory} from './BookStory.js';

const SPEAKER_COLORS = Object.freeze({
  catpat: '#237768',
  maymun: '#875a3d',
  porsuk: '#675354',
  pitpit: '#8b6a5c',
  market_cashier: '#76508f',
});

export const SPEAKERS = Object.freeze(Object.fromEntries(
  Object.entries(BOOK_SPEAKERS).map(([id, speaker]) => [id, Object.freeze({
    ...speaker,
    color: SPEAKER_COLORS[id],
  })]),
));

export const INTRO = Object.freeze([
  Object.freeze({
    speaker: 'catpat',
    text: BOOK_EVENTS.fatherTalk.lesson,
    emotion: 'thoughtful',
  }),
]);

export function missionStory(id, phase = 'before') {
  return bookMissionStory(id, phase);
}

export function festivalStory() {
  return {
    title: 'Nezaketi Hatırlıyorum',
    lines: [{speaker: 'catpat', text: BOOK_EVENTS.fatherTalk.lesson, emotion: 'thoughtful'}],
  };
}

export class DialogueSequence {
  constructor(lines) {
    if (!Array.isArray(lines) || !lines.length) throw new Error('Dialogue needs at least one line');
    for (const item of lines) {
      if (!SPEAKERS[item.speaker] || typeof item.text !== 'string' || !item.text.trim()) throw new Error('Invalid dialogue line');
    }
    this.lines = lines.map(item => ({...item}));
    this.index = 0;
  }
  get current() { return this.lines[this.index] ?? null; }
  get done() { return this.index >= this.lines.length; }
  advance() { if (!this.done) this.index += 1; return this.current; }
}
