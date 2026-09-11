import {assertBookCharacter, assertBookEvent} from './BookCanon.js';

export const BOOK_SPEAKERS = Object.freeze({
  catpat: Object.freeze({name: 'Çatpat', portrait: 'catpat'}),
  maymun: Object.freeze({name: 'Maymun', portrait: 'friend_maymun'}),
  porsuk: Object.freeze({name: 'Porsuk', portrait: 'friend_porsuk'}),
  pitpit: Object.freeze({name: 'Pıtpıt', portrait: 'friend_pitpit'}),
  market_cashier: Object.freeze({name: 'Kasiyer', portrait: 'npc_market_cashier'}),
});

for (const id of Object.keys(BOOK_SPEAKERS)) assertBookCharacter(id);

const say = (speaker, text, emotion = 'neutral') => Object.freeze({speaker, text, emotion});

const STORIES = Object.freeze({
  'branch-game-invitation': Object.freeze({
    title: 'Dal Dal Üstüne',
    before: Object.freeze([
      say('maymun', 'Porsuk’la dallardan bir oyun kurduk. İstersen sen de bize katılabilirsin.', 'friendly'),
      say('porsuk', 'Önce nasıl oynandığını gösterebiliriz. Sonra karar verirsin.', 'friendly'),
      say('catpat', 'Tamam, önce sizi dinleyeyim. Sonra parkuru birlikte deneyelim.', 'listening'),
    ]),
    after: Object.freeze([
      say('catpat', 'Oynamak istemediğim zaman bile bunu güzelce söyleyebilirim. Davetiniz için teşekkür ederim.', 'thoughtful'),
      say('maymun', 'Bizi dinlemen çok güzeldi.', 'happy'),
      say('porsuk', 'Yola birlikte devam edebiliriz.', 'happy'),
    ]),
  }),
  'market-queue': Object.freeze({
    title: 'Sıra Bende mi?',
    before: Object.freeze([
      say('market_cashier', 'Herkes sırasını beklerse alışveriş daha rahat ilerler.', 'friendly'),
      say('catpat', 'Ben de acele etmeyeyim. Sıram gelince isteğimi nazikçe söyleyeceğim.', 'listening'),
    ]),
    after: Object.freeze([
      say('catpat', 'Sıramı bekledim. Yardım ettiğiniz için teşekkür ederim.', 'happy'),
      say('market_cashier', 'Rica ederim Çatpat. Böyle olunca herkesin işi kolaylaşıyor.', 'happy'),
    ]),
  }),
  'pitpit-daisy-garden': Object.freeze({
    title: 'Pıtpıt’ın Papatyaları',
    before: Object.freeze([
      say('pitpit', 'Bu papatyaları annem için özenle seçiyorum. Bahçenin arasından geçerken dikkat eder misin?', 'careful'),
      say('catpat', 'Evet. Hızlanmadan, çiçeklere zarar vermeden geçeceğim.', 'determined'),
    ]),
    after: Object.freeze([
      say('catpat', 'Başkasının emeğini düşünmek de yolculuğun bir parçasıymış.', 'thoughtful'),
      say('pitpit', 'Dikkat ettiğin için teşekkür ederim. Ben de sizinle geleyim.', 'happy'),
    ]),
    repair: Object.freeze([
      say('catpat', 'Bir papatyaya zarar verdim. Özür dilerim; önce onu düzeltmek istiyorum.', 'sorry'),
      say('pitpit', 'Fark edip geri dönmen benim için önemli.', 'gentle'),
    ]),
  }),
});

for (const eventId of Object.keys(STORIES)) assertBookEvent(eventId);

export function bookMissionStory(eventId, phase = 'before') {
  const story = STORIES[eventId];
  if (!story) throw new Error(`Missing book story: ${eventId}`);
  const lines = story[phase];
  if (!lines) throw new Error(`Missing book story phase: ${eventId}/${phase}`);
  for (const item of lines) assertBookCharacter(item.speaker);
  return {title: story.title, lines: lines.map(item => ({...item}))};
}

export function bookRepairStory(eventId) {
  return bookMissionStory(eventId, 'repair');
}
