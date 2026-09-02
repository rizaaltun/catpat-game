import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

import {Player, surfaceYAt} from '../src/game/Player.js';
import {LEVELS, createLevel} from '../src/game/levels.js';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url)));
const manifests = {
  platforms: await readJson('../assets/environments/forest/platforms_v03/platform_manifest.json'),
  decorations: await readJson('../assets/environments/forest/decorations_v02/manifest.json'),
  objects: await readJson('../assets/gameplay/forest/objects_v03/manifest.json'),
  mechanisms: await readJson('../assets/gameplay/forest/mechanisms_v04/manifest.json'),
};
const character = await readJson('../assets/characters/catpat/animation_v03/animation_manifest.json');
const level = createLevel(LEVELS[0], manifests);
const bridge = level.platforms.find(platform => platform.id === 'crate-bridge');
for (const surface of bridge.surfaces) {
  surface.y1 -= bridge.currentOffsetY;
  surface.y2 -= bridge.currentOffsetY;
}
bridge.y -= bridge.currentOffsetY;
bridge.currentOffsetY = 0;

const owners = new Map([
  ...level.platforms.map(platform => [platform.id, platform]),
  ...level.objects.filter(object => object.surfaces?.length).map(object => [object.id, object]),
]);
const route = [
  'start',
  'trail-step',
  'trail-ramp',
  'flower-garden',
  'garden-short',
  'garden-step',
  'trail-long',
  'checkpoint-rock-1',
  'rest-garden',
  'cloud-launch',
  'moving-cloud',
  'cloud-landing',
  'lift-step',
  'stone-lift',
  'lift-balcony',
  'balcony-step',
  'descent-step',
  'descent-garden',
  'checkpoint-run-2',
  'button-floor',
  'gate-floor',
  'gate-ramp',
  'rise-one',
  'rise-two',
  'gate-lookout',
  'lookout-step',
  'checkpoint-run-3',
  'swing-platform',
  'swing-landing',
  'rhythm-one',
  'rhythm-two',
  'rhythm-bridge',
  'mud-run',
  'rhythm-ramp',
  'rhythm-lift',
  'checkpoint-garden-4',
  'crate-run',
  'weight-stone',
  'crate-bridge',
  'mushroom-garden',
  'return-step',
  'festival-ramp',
  'festival-highway',
  'festival-step',
  'festival-floor',
];

for (let index = 0; index < route.length - 1; index += 1) {
  const source = owners.get(route[index]);
  const destination = owners.get(route[index + 1]);
  assert.ok(source && destination);
  assert.equal(canJump(source, destination), true, `${source.id} cannot reach ${destination.id}`);
}

const mushroom = level.objects.find(object => object.id === 'mushroom');
const highTicket = owners.get('high-ticket');
const bouncePlayer = new Player(mushroom.x, mushroom.y - character.collider.height / 2, character.collider);
bouncePlayer.previousFeetY = bouncePlayer.feetY;
bouncePlayer.vy = -1120;
const neutralInput = {state: {left: false, right: false, jump: true, focus: false, interact: false}, consume: () => false};
for (let frame = 0; frame < 180 && bouncePlayer.groundedSurface?.owner !== highTicket; frame += 1) {
  bouncePlayer.update(1 / 60, neutralInput, {surfaces: highTicket.surfaces, speedMultiplier: 1});
}
assert.equal(bouncePlayer.groundedSurface?.owner, highTicket, 'mushroom launch cannot reach high ticket');

console.log(`level 01 reachability: ${route.length - 1} jumps + mushroom route OK`);

function canJump(source, destination) {
  const sourceSurface = [...source.surfaces].sort((a, b) => Math.max(b.x1, b.x2) - Math.max(a.x1, a.x2))[0];
  const sourceRight = Math.max(sourceSurface.x1, sourceSurface.x2);
  const sourceLeft = Math.min(...source.surfaces.flatMap(surface => [surface.x1, surface.x2]));
  for (const offset of [18, 55, 95, 135, 180]) {
    for (const initialSpeed of [150, 220, 285, 325]) {
      for (const accelerate of [true, false]) {
        const startX = Math.max(sourceLeft + 12, sourceRight - offset);
        const startY = surfaceYAt(sourceSurface, startX);
        const player = new Player(startX, startY - character.collider.height / 2, character.collider);
        player.grounded = true;
        player.groundedSurface = sourceSurface;
        player.vx = initialSpeed;
        let jumpAvailable = true;
        const jumpInput = {
          state: {left: false, right: accelerate, jump: true, focus: false, interact: false},
          consume: key => {
            if (key !== 'jump' || !jumpAvailable) return false;
            jumpAvailable = false;
            return true;
          },
        };
        const world = {surfaces: [...source.surfaces, ...destination.surfaces], speedMultiplier: 1};
        for (let frame = 0; frame < 180; frame += 1) {
          player.update(1 / 60, jumpInput, world);
          if (player.groundedSurface?.owner === destination) return true;
          if (player.y > 900) break;
        }
      }
    }
  }
  return false;
}
