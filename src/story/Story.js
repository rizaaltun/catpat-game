// Narrative is data, independent of DOM/physics, so it can be reviewed and tested.
export const SPEAKERS = Object.freeze({
  catpat: {name: '\u00c7atpat', color: '#237768', portrait: 'catpat'},
  porsuk: {name: 'Porsuk', color: '#675354', portrait: 'friend_porsuk_sheet.png'},
  baykus: {name: 'Bayku\u015f', color: '#526b83', portrait: 'friend_baykus_sheet.png'},
  civciv: {name: 'Civciv', color: '#af701e', portrait: 'friend_civciv_sheet.png'},
});

const line = (speaker, text, emotion = 'waiting') => ({speaker, text, emotion});

export const INTRO = Object.freeze([
  line('catpat', 'Bug\u00fcn ormanda festival var! Ama bu yolculu\u011fun en g\u00fczel yan\u0131, oraya birlikte gitmek.'),
  line('porsuk', 'Bah\u00e7em yard\u0131m bekliyor. Birlikte yeni bir tohum ekebilir miyiz?'),
  line('baykus', 'Benim yolum biraz karanl\u0131k. Fenerleri birlikte yakarsak yolu bulabilirim.'),
  line('civciv', 'Ben de topumu kaybettim. Onu bulmama yard\u0131m eder misin?'),
  line('catpat', '\u00d6nce dostlar\u0131ma yard\u0131m edece\u011fim. Sonra \u00fc\u00e7 festival biletini bulup hep birlikte yola devam edece\u011fiz!', 'happy'),
]);

const QUESTS = Object.freeze({
  'apple-garden': {
    title: 'Bir tohum, yeni bir ba\u015flang\u0131\u00e7', friend: 'porsuk',
    before: [
      line('porsuk', 'R\u00fczg\u00e2r fidan\u0131m\u0131 devirdi. Festivale elma g\u00f6t\u00fcrecektim; \u015fimdi ne yapaca\u011f\u0131m\u0131 bilmiyorum.'),
      line('catpat', 'Yeniden ba\u015flayabiliriz. Ben bir tohum bulay\u0131m; sen de sepetini haz\u0131rla.'),
      line('porsuk', 'Tohumu topra\u011fa ekelim. A\u011fa\u00e7 b\u00fcy\u00fcy\u00fcnce be\u015f elmay\u0131 toplay\u0131p sepete b\u0131rakabiliriz.'),
      line('catpat', 'Anla\u015ft\u0131k. Acele etmeden, birlikte!'),
    ],
    after: [
      line('porsuk', 'Sepetimiz doldu! Yaln\u0131z yapamayaca\u011f\u0131m\u0131 d\u00fc\u015f\u00fcn\u00fcyordum. Yan\u0131mda olman iyi geldi.', 'happy'),
      line('catpat', '\u015eimdi festivale birlikte gidelim mi?', 'happy'),
      line('porsuk', 'Seve seve! Yolda birinin yard\u0131ma ihtiyac\u0131 olursa ben de yan\u0131n\u0131zday\u0131m.', 'happy'),
    ],
  },
  'dark-lanterns': {
    title: 'Payla\u015f\u0131lan \u0131\u015f\u0131k', friend: 'baykus',
    before: [
      line('baykus', 'Bu patika karanl\u0131kta pek farkl\u0131 g\u00f6r\u00fcn\u00fcyor. Bir sonraki basama\u011f\u0131 se\u00e7emiyorum.'),
      line('catpat', 'Yan\u0131nday\u0131m. \u00d6nce en yak\u0131ndaki feneri yakal\u0131m.'),
      line('baykus', 'Yolda \u00fc\u00e7 fener var. Her birinin yan\u0131na gidip etkile\u015fim tu\u015funa basabilirsin.'),
      line('catpat', 'Birer birer ilerleriz. Birlikteyken yol daha ayd\u0131nl\u0131k!'),
    ],
    after: [
      line('baykus', 'Art\u0131k b\u00fct\u00fcn basamaklar\u0131 g\u00f6rebiliyorum. I\u015f\u0131\u011f\u0131n\u0131 benimle payla\u015ft\u0131\u011f\u0131n i\u00e7in te\u015fekk\u00fcr ederim.', 'happy'),
      line('catpat', 'Festivale giden yolda bize kat\u0131l\u0131r m\u0131s\u0131n?', 'happy'),
      line('baykus', 'Elbette! Bundan sonra yolu birlikte g\u00f6zetiriz.', 'happy'),
    ],
  },
  'lost-toy': {
    title: 'K\u00fc\u00e7\u00fck bir top, b\u00fcy\u00fck bir sevin\u00e7', friend: 'civciv',
    before: [
      line('civciv', 'Topum kar\u015f\u0131daki platforma yuvarland\u0131. O kadar uza\u011fa z\u0131playam\u0131yorum.'),
      line('catpat', 'Sen burada g\u00fcvende bekle. Basamaklar\u0131 izleyip topunu bulaca\u011f\u0131m.'),
      line('civciv', 'Onu \u00e7ok seviyorum. Benim i\u00e7in zaman ay\u0131rd\u0131\u011f\u0131na sevindim.'),
      line('catpat', 'K\u00fc\u00e7\u00fck bir \u015fey olabilir; ama senin i\u00e7in \u00f6nemli. Hemen geliyorum!'),
    ],
    after: [
      line('civciv', 'Topum! Beni dinledin ve yard\u0131m ettin. \u00c7ok mutlu oldum!', 'happy'),
      line('catpat', 'Festivale birlikte gidelim. Yolda seni bekleriz.', 'happy'),
      line('civciv', 'Ya\u015fas\u0131n! Ben de sizinle geliyorum!', 'happy'),
    ],
  },
});

export function missionStory(id, phase = 'before') {
  const quest = QUESTS[id];
  if (!quest || !['before', 'after'].includes(phase)) throw new Error(`Unknown story: ${id}/${phase}`);
  return {title: quest.title, lines: quest[phase].map(item => ({...item}))};
}

export function festivalStory(friends) {
  const lines = [line('catpat', 'Festivalin \u0131\u015f\u0131klar\u0131 g\u00f6r\u00fcnd\u00fc. En g\u00fczel k\u0131sm\u0131, buraya birlikte gelmemiz!', 'happy')];
  for (const friend of friends.filter(item => item.helped)) {
    const speaker = QUESTS[friend.missionId]?.friend;
    if (speaker) lines.push(line(speaker, {
      porsuk: 'Elmalar\u0131m\u0131z\u0131 payla\u015faca\u011f\u0131z. Bir tohumdan ne g\u00fczel bir g\u00fcn do\u011fdu!',
      baykus: 'Yolumu ayd\u0131nlatt\u0131n. \u015eimdi hepimizin ne\u015fesi buray\u0131 ayd\u0131nlat\u0131yor.',
      civciv: 'Topum da burada, dostlar\u0131m da. Haydi birlikte oynayal\u0131m!',
    }[speaker], 'happy'));
  }
  lines.push(line('catpat', 'Biraz durup dinleyince, k\u00fc\u00e7\u00fck bir yard\u0131m kocaman bir dostlu\u011fa d\u00f6n\u00fc\u015febiliyor.', 'happy'));
  return {title: 'Festival daha g\u00fczel, birlikte!', lines};
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
