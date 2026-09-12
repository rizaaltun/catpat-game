const LEGACY_MISSION_IDS = new Set(['apple-garden', 'dark-lanterns', 'lost-toy']);
const LEGACY_CHARACTER_IDS = new Set(['baykus', 'civciv']);

export const PRODUCTION_TRAVERSAL_OBJECTIVE = 'Şenlik yolunda ilerle, üç şenlik biletini bul ve giriş masasına ulaş.';

export function productionFriendRejectionReasons(friend = {}) {
  const reasons = [];
  if (LEGACY_MISSION_IDS.has(friend.missionId)) reasons.push('book-external-mission');
  if (LEGACY_CHARACTER_IDS.has(friend.characterId) || LEGACY_CHARACTER_IDS.has(friend.id)) {
    reasons.push('book-external-character');
  }
  if (typeof friend.sheetAsset === 'string' && /sheet/i.test(friend.sheetAsset)) {
    reasons.push('sprite-sheet-runtime-art');
  }
  return reasons;
}

export function applyProductionCanonLock(level) {
  if (!level || !Array.isArray(level.friends)) {
    return {removedFriends: [], activeFriends: [], removedNarrativeZones: 0};
  }

  const removedFriends = [];
  const activeFriends = [];
  for (const friend of level.friends) {
    const reasons = productionFriendRejectionReasons(friend);
    if (reasons.length) removedFriends.push({id: friend.id, missionId: friend.missionId, reasons});
    else activeFriends.push(friend);
  }

  level.friends = activeFriends;
  const removedNarrativeZones = Array.isArray(level.zones) ? level.zones.length : 0;
  if (Array.isArray(level.zones)) level.zones = [];
  if (removedFriends.length) level.objective = PRODUCTION_TRAVERSAL_OBJECTIVE;
  return {
    removedFriends,
    activeFriends: activeFriends.map(friend => friend.id),
    removedNarrativeZones,
  };
}

export function filterProductionEvents(events = []) {
  const accepted = [];
  const blocked = [];
  for (const event of events) {
    if (event?.type === 'dialogue') {
      blocked.push({event, reason: 'non-book-traversal-dialogue-disabled'});
      continue;
    }
    if (event?.type === 'enter-mission') {
      blocked.push({event, reason: 'legacy-mission-entry-disabled'});
      continue;
    }
    accepted.push(event);
  }
  return {accepted, blocked};
}
