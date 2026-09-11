import {assertBookEvent} from '../story/BookCanon.js';
import {createPlatform} from './levels.js';
import {createBookMissionDescriptor} from './BookMissionModel.js';

const BLUEPRINTS = Object.freeze({
  'branch-game-invitation': Object.freeze({
    runtimeStatus: 'blocked-until-book-character-art-ready',
    kind: 'branch-course',
    length: 2800,
    spawn: {x: 120, y: 440},
    objective: 'Maymun ve Porsuk’u dinle, dal parkurunu tamamla ve nazikçe cevap ver.',
    platforms: Object.freeze([
      {id: 'branch-start', asset: 'platform_medium.png', x: 0, y: 540, scale: 0.90},
      {id: 'branch-step-a', asset: 'platform_short.png', x: 640, y: 500, scale: 0.82},
      {id: 'branch-step-b', asset: 'platform_short.png', x: 940, y: 440, scale: 0.82},
      {id: 'branch-run', asset: 'platform_long.png', x: 1250, y: 500, scale: 0.90},
      {id: 'branch-finish', asset: 'platform_medium.png', x: 2060, y: 520, scale: 0.90},
    ]),
    behaviourTriggers: Object.freeze({
      'listen-before-start': {x: 310, y: 540, radius: 125, input: 'interact'},
      'complete-course': {x: 2050, y: 520, radius: 150, input: 'automatic'},
      'polite-response': {x: 2360, y: 520, radius: 135, input: 'interact'},
    }),
    castAnchors: Object.freeze({maymun: {x: 250, y: 540}, porsuk: {x: 430, y: 540}}),
    requiredCharacterAssets: Object.freeze(['maymun', 'porsuk']),
    recruits: Object.freeze(['maymun', 'porsuk']),
  }),
  'market-queue': Object.freeze({
    runtimeStatus: 'blocked-until-market-art-ready',
    kind: 'queue-order',
    length: 2100,
    spawn: {x: 120, y: 470},
    objective: 'Sıranı bekle, isteğini nazikçe söyle ve kasiyere teşekkür et.',
    platforms: Object.freeze([
      {id: 'market-floor-a', asset: 'platform_long.png', x: 0, y: 560, scale: 0.95},
      {id: 'market-floor-b', asset: 'platform_long.png', x: 797, y: 560, scale: 0.95},
      {id: 'market-counter-floor', asset: 'platform_medium.png', x: 1600, y: 560, scale: 0.90},
    ]),
    behaviourTriggers: Object.freeze({
      'wait-turn': {x: 760, y: 560, radius: 145, holdSeconds: 2.0},
      'ask-politely': {x: 1500, y: 560, radius: 120, input: 'interact'},
      'thank-cashier': {x: 1810, y: 560, radius: 120, input: 'interact'},
    }),
    castAnchors: Object.freeze({market_cashier: {x: 1840, y: 560}}),
    requiredCharacterAssets: Object.freeze(['market_cashier']),
    recruits: Object.freeze([]),
  }),
  'pitpit-daisy-garden': Object.freeze({
    runtimeStatus: 'blocked-until-pitpit-git-asset-and-daisy-art-ready',
    kind: 'careful-traversal',
    length: 2600,
    spawn: {x: 120, y: 450},
    objective: 'Papatyalara zarar vermeden ilerle; zarar verirsen düzelt ve Pıtpıt’tan özür dile.',
    platforms: Object.freeze([
      {id: 'daisy-start', asset: 'platform_medium.png', x: 0, y: 540, scale: 0.90},
      {id: 'daisy-garden-a', asset: 'platform_long.png', x: 620, y: 550, scale: 0.95},
      {id: 'daisy-garden-b', asset: 'platform_long.png', x: 1420, y: 550, scale: 0.95},
      {id: 'daisy-finish', asset: 'platform_medium.png', x: 2210, y: 540, scale: 0.90},
    ]),
    behaviourTriggers: Object.freeze({
      'protect-daisies': {x1: 720, x2: 1980, maxSpeed: 185, input: 'movement'},
      'repair-if-damaged': {x: 1960, y: 550, radius: 135, input: 'interact-if-needed'},
      apologize: {x: 2310, y: 540, radius: 125, input: 'interact'},
    }),
    castAnchors: Object.freeze({pitpit: {x: 2350, y: 540}}),
    requiredCharacterAssets: Object.freeze(['pitpit']),
    recruits: Object.freeze(['pitpit']),
  }),
});

for (const eventId of Object.keys(BLUEPRINTS)) {
  const event = assertBookEvent(eventId);
  const blueprint = BLUEPRINTS[eventId];
  if (blueprint.kind !== event.gameplay.kind) throw new Error(`Book mission kind mismatch: ${eventId}`);
  if (JSON.stringify(blueprint.recruits) !== JSON.stringify(event.gameplay.recruits)) {
    throw new Error(`Book mission recruits mismatch: ${eventId}`);
  }
}

export function getBookMissionBlueprint(eventId) {
  const blueprint = BLUEPRINTS[eventId];
  if (!blueprint) throw new Error(`Missing book mission blueprint: ${eventId}`);
  return {
    ...blueprint,
    id: eventId,
    spawn: {...blueprint.spawn},
    platforms: blueprint.platforms.map(item => ({...item})),
    behaviourTriggers: Object.fromEntries(
      Object.entries(blueprint.behaviourTriggers).map(([key, value]) => [key, {...value}]),
    ),
    castAnchors: Object.fromEntries(
      Object.entries(blueprint.castAnchors).map(([key, value]) => [key, {...value}]),
    ),
    requiredCharacterAssets: [...blueprint.requiredCharacterAssets],
    recruits: [...blueprint.recruits],
    bookDescriptor: createBookMissionDescriptor(eventId),
  };
}

export function bookMissionRuntimeReady(eventId, availableCharacters = []) {
  const blueprint = getBookMissionBlueprint(eventId);
  const available = new Set(availableCharacters);
  const missing = blueprint.requiredCharacterAssets.filter(id => !available.has(id));
  return {ready: missing.length === 0, missing, runtimeStatus: blueprint.runtimeStatus};
}

export function createBookMissionWorld(eventId, manifests, availableCharacters = []) {
  const gate = bookMissionRuntimeReady(eventId, availableCharacters);
  if (!gate.ready) throw new Error(`Book mission art gate blocked ${eventId}: ${gate.missing.join(', ')}`);
  if (!manifests?.platforms) throw new Error(`Book mission platform manifest missing: ${eventId}`);

  const blueprint = getBookMissionBlueprint(eventId);
  const platforms = blueprint.platforms.map(config => createPlatform(config, manifests.platforms));
  const surfaces = platforms.flatMap(platform => platform.surfaces);
  return {
    id: eventId,
    type: 'book-mission',
    kind: blueprint.kind,
    length: blueprint.length,
    spawn: {...blueprint.spawn},
    objectiveText: blueprint.objective,
    platforms,
    decorations: [],
    objects: [],
    surfaces,
    behaviourTriggers: blueprint.behaviourTriggers,
    castAnchors: blueprint.castAnchors,
    bookDescriptor: blueprint.bookDescriptor,
    requiredCharacterAssets: blueprint.requiredCharacterAssets,
    speedMultiplier: 1,
  };
}
