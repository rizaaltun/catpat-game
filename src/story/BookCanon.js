export const BOOK_CAST = Object.freeze({
  catpat: Object.freeze({id: 'catpat', name: 'Çatpat', role: 'player', evidence: [2,3,4,5,6,7,8,9,10,11]}),
  maymun: Object.freeze({id: 'maymun', name: 'Maymun', role: 'friend', evidence: [4,10]}),
  porsuk: Object.freeze({id: 'porsuk', name: 'Porsuk', role: 'friend', evidence: [4,10]}),
  pitpit: Object.freeze({id: 'pitpit', name: 'Pıtpıt', role: 'friend', evidence: [5,10]}),
  market_cashier: Object.freeze({id: 'market_cashier', name: 'Kasiyer', role: 'npc', evidence: [6]}),
});

export const BOOK_EVENTS = Object.freeze({
  branchGame: Object.freeze({
    id: 'branch-game-invitation',
    cast: ['catpat', 'maymun', 'porsuk'],
    evidence: [4,10],
    lesson: 'Bir davete katılmak istemiyorsan bile nazikçe cevap verebilirsin.',
    gameplay: Object.freeze({
      kind: 'branch-course',
      recruits: ['maymun', 'porsuk'],
      requiredBehaviours: ['listen-before-start', 'complete-course', 'polite-response'],
    }),
  }),
  daisyGarden: Object.freeze({
    id: 'pitpit-daisy-garden',
    cast: ['catpat', 'pitpit'],
    evidence: [5,10],
    lesson: 'Başkalarının emeğini düşünerek dikkatli hareket etmek de nezakettir.',
    gameplay: Object.freeze({
      kind: 'careful-traversal',
      recruits: ['pitpit'],
      requiredBehaviours: ['protect-daisies', 'repair-if-damaged', 'apologize'],
    }),
  }),
  marketQueue: Object.freeze({
    id: 'market-queue',
    cast: ['catpat', 'market_cashier'],
    evidence: [6,10],
    lesson: 'Sıranı beklemek ve başkalarının zamanını düşünmek birlikte yaşamanın parçasıdır.',
    gameplay: Object.freeze({
      kind: 'queue-order',
      recruits: [],
      requiredBehaviours: ['wait-turn', 'ask-politely', 'thank-cashier'],
    }),
  }),
  fatherTalk: Object.freeze({
    id: 'father-conversation',
    cast: ['catpat'],
    evidence: [7,8,9],
    lesson: 'Lütfen, teşekkür ederim ve özür dilerim sözleri davranışla birlikte anlam kazanır.',
    gameplay: Object.freeze({kind: 'reflection-comic', recruits: [], requiredBehaviours: ['listen', 'reflect']}),
  }),
});

export const CHAPTER_ONE_BOOK_PLAN = Object.freeze([
  BOOK_EVENTS.branchGame,
  BOOK_EVENTS.marketQueue,
  BOOK_EVENTS.daisyGarden,
  BOOK_EVENTS.fatherTalk,
]);

export function assertBookCharacter(id) {
  if (!BOOK_CAST[id]) throw new Error(`Book character is not verified: ${id}`);
  return BOOK_CAST[id];
}

export function assertBookEvent(id) {
  const event = Object.values(BOOK_EVENTS).find(item => item.id === id);
  if (!event) throw new Error(`Book event is not verified: ${id}`);
  for (const character of event.cast) assertBookCharacter(character);
  return event;
}
