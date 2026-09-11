import {bookMissionRuntimeReady, createBookMissionWorld} from './BookMissionBlueprints.js';

const REQUIRED_SCENES = Object.freeze({
  'branch-game-invitation': Object.freeze(['branch_course_scene']),
  'market-queue': Object.freeze(['market_queue_scene']),
  'pitpit-daisy-garden': Object.freeze(['daisy_garden_scene']),
});

export function productionBookMissionReady(eventId, availableCharacters = [], availableScenes = []) {
  const characterGate = bookMissionRuntimeReady(eventId, availableCharacters);
  const scenes = new Set(availableScenes);
  const requiredScenes = REQUIRED_SCENES[eventId];
  if (!requiredScenes) throw new Error(`Missing production scene gate: ${eventId}`);
  const missingScenes = requiredScenes.filter(id => !scenes.has(id));
  return {
    ready: characterGate.ready && missingScenes.length === 0,
    missingCharacters: characterGate.missing,
    missingScenes,
    requiredScenes: [...requiredScenes],
  };
}

export function createProductionBookMissionWorld(eventId, manifests, availableCharacters = [], availableScenes = []) {
  const gate = productionBookMissionReady(eventId, availableCharacters, availableScenes);
  if (!gate.ready) {
    const missing = [...gate.missingCharacters, ...gate.missingScenes];
    throw new Error(`Production book mission art gate blocked ${eventId}: ${missing.join(', ')}`);
  }
  const world = createBookMissionWorld(eventId, manifests, availableCharacters);
  return {...world, requiredSceneAssets: gate.requiredScenes};
}

export function requiredBookMissionScenes(eventId) {
  const scenes = REQUIRED_SCENES[eventId];
  if (!scenes) throw new Error(`Missing production scene gate: ${eventId}`);
  return [...scenes];
}
