import {assertBookCharacter, assertBookEvent} from '../story/BookCanon.js';

export function createBookMissionDescriptor(eventId) {
  const event = assertBookEvent(eventId);
  const cast = event.cast.map(id => assertBookCharacter(id));
  const recruitIds = [...event.gameplay.recruits];
  for (const id of recruitIds) assertBookCharacter(id);
  return {
    id: event.id,
    castIds: cast.map(item => item.id),
    recruitIds,
    primarySpeakerId: cast.find(item => item.id !== 'catpat')?.id ?? 'catpat',
    requiredBehaviours: [...event.gameplay.requiredBehaviours],
    bookEvidence: [...event.evidence],
  };
}

export function resolveRecruitableFriends(levelFriends, descriptor) {
  const byId = new Map((levelFriends || []).map(friend => [friend.id, friend]));
  return descriptor.recruitIds.map(id => {
    const friend = byId.get(`friend-${id}`) || byId.get(id);
    if (!friend) throw new Error(`Book mission recruit missing from level: ${id}`);
    return friend;
  });
}

export function markMissionRecruitsHelped(levelFriends, descriptor) {
  const recruits = resolveRecruitableFriends(levelFriends, descriptor);
  for (const friend of recruits) friend.helped = true;
  return recruits;
}
