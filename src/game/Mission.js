import {createPlatform, createObject, createDecoration, segmentsFromPoints} from './levels.js';

// Each "help a friend" mission is a small, self-contained pocket world with
// its own coordinate space (always starting near x=0) — entering/leaving is
// a teleport, never a physical walk from the main path, so mission worlds
// never need to share the main level's 15,200px coordinate space.
const MISSIONS = {
  'apple-garden': {
    id: 'apple-garden',
    length: 2450,
    tint: 'rgba(255, 214, 130, 0.14)',
    spawn: {x: 90, y: 420},
    introText: 'Rüzgâr elma fidanımı devirdi. Bir tohum bulup yeniden eksem, bahçem tekrar meyve verir mi?',
    objectiveText: 'Porsuk’a yardım et: tohumu ek, elmaları topla, sepete bırak',
    platformConfigs: [
      {id: 'mission-start', asset: 'platform_medium.png', x: 0, y: 520, scale: 0.9},
      {id: 'mission-rise', asset: 'platform_short.png', x: 596.5, y: 460, scale: 0.9},
      {id: 'mission-garden', asset: 'platform_long.png', x: 863.5, y: 500, scale: 0.95},
      {id: 'mission-basket', asset: 'platform_medium.png', x: 1660.5, y: 520, scale: 0.9},
    ],
    decorationConfigs: [
      {id: 'd1', asset: 'decor_tree.png', x: 60, y: 520, scale: 0.5, layer: 'back'},
      {id: 'd2', asset: 'decor_bush.png', x: 650, y: 460, scale: 0.3, layer: 'back'},
      {id: 'd3', asset: 'decor_tree.png', x: 950, y: 500, scale: 0.42, layer: 'back'},
      {id: 'd4', asset: 'decor_flowers.png', x: 1350, y: 500, scale: 0.26, layer: 'front'},
      {id: 'd5', asset: 'decor_bush.png', x: 1750, y: 520, scale: 0.32, layer: 'back'},
      {id: 'd6', asset: 'decor_grass.png', x: 300, y: 520, scale: 0.22, layer: 'front'},
    ],
    objectConfigs: [
      {id: 'apple-1', asset: 'obj_apple.png', kind: 'apple-prop', x: 1090, y: 340, scale: 0.22},
      {id: 'apple-2', asset: 'obj_apple.png', kind: 'apple-prop', x: 1150, y: 320, scale: 0.22},
      {id: 'apple-3', asset: 'obj_apple.png', kind: 'apple-prop', x: 1210, y: 345, scale: 0.22},
      {id: 'apple-4', asset: 'obj_apple.png', kind: 'apple-prop', x: 1150, y: 370, scale: 0.22},
    ],
    props: {
      seed: {x: 200, y: 520, radius: 70, taken: false},
      plot: {x: 1150, y: 500, radius: 90},
      basket: {x: 1900, y: 520, radius: 90},
    },
    friendSpawn: {x: 1950, y: 520},
  },
  'dark-lanterns': {
    id: 'dark-lanterns',
    length: 3400,
    tint: 'rgba(18, 24, 54, 0.5)',
    spawn: {x: 90, y: 420},
    introText: 'Karanlıkta yuvama dönerken yolumu göremiyorum. Bu inişli çıkışlı yolda fenerleri benimle yakar mısın?',
    objectiveText: 'Baykuş’a yardım et: üç feneri de yak',
    platformConfigs: [
      {id: 'mission-start', asset: 'platform_medium.png', x: 0, y: 520, scale: 0.9},
      {id: 'mission-step1', asset: 'platform_short.png', x: 606.5, y: 460, scale: 0.9},
      {id: 'mission-mid', asset: 'platform_long.png', x: 903.5, y: 510, scale: 0.95},
      {id: 'mission-step2', asset: 'platform_short.png', x: 1690.5, y: 450, scale: 0.9},
      {id: 'mission-lower', asset: 'platform_medium.png', x: 1997.5, y: 520, scale: 0.9},
      {id: 'mission-end', asset: 'platform_medium.png', x: 2604, y: 480, scale: 0.9},
    ],
    decorationConfigs: [
      {id: 'd1', asset: 'decor_tree.png', x: 60, y: 520, scale: 0.46, layer: 'back'},
      {id: 'd2', asset: 'decor_tree.png', x: 1100, y: 510, scale: 0.5, layer: 'back'},
      {id: 'd3', asset: 'decor_bush.png', x: 1350, y: 510, scale: 0.3, layer: 'back'},
      {id: 'd4', asset: 'decor_grass.png', x: 2100, y: 520, scale: 0.22, layer: 'front'},
      {id: 'd5', asset: 'decor_tree.png', x: 2800, y: 480, scale: 0.44, layer: 'back'},
    ],
    objectConfigs: [
      {id: 'lantern-1', asset: 'obj_lantern.png', kind: 'lantern-prop', x: 665, y: 460, scale: 0.22},
      {id: 'lantern-2', asset: 'obj_lantern.png', kind: 'lantern-prop', x: 1750, y: 450, scale: 0.22},
      {id: 'lantern-3', asset: 'obj_lantern.png', kind: 'lantern-prop', x: 2660, y: 480, scale: 0.22},
    ],
    props: {},
    friendSpawn: {x: 2900, y: 480},
  },
  'lost-toy': {
    id: 'lost-toy',
    length: 1900,
    tint: 'rgba(255, 255, 255, 0)',
    spawn: {x: 90, y: 440},
    introText: 'Topum boşluğun öbür ucuna yuvarlandı. Küçüğüm, o kadar zıplayamıyorum — sen alabilir misin?',
    objectiveText: 'Civciv’e yardım et: kayıp topu bul',
    platformConfigs: [
      {id: 'mission-start', asset: 'platform_medium.png', x: 0, y: 540, scale: 0.9},
      {id: 'mission-step1', asset: 'platform_short.png', x: 606.5, y: 480, scale: 0.9},
      {id: 'mission-step2', asset: 'platform_short.png', x: 883.5, y: 420, scale: 0.9},
      {id: 'mission-far', asset: 'platform_medium.png', x: 1170.5, y: 360, scale: 0.9},
    ],
    decorationConfigs: [
      {id: 'd1', asset: 'decor_bush.png', x: 60, y: 540, scale: 0.28, layer: 'back'},
      {id: 'd2', asset: 'decor_tree.png', x: 750, y: 480, scale: 0.4, layer: 'back'},
      {id: 'd3', asset: 'decor_flowers.png', x: 1400, y: 360, scale: 0.24, layer: 'front'},
    ],
    objectConfigs: [
      {id: 'lost-toy-star', asset: 'obj_star.png', kind: 'toy-prop', x: 1350, y: 360, scale: 0.24},
    ],
    props: {},
    friendSpawn: {x: 60, y: 540},
  },
};

export function createMissionWorld(missionId, manifests) {
  const config = MISSIONS[missionId];
  if (!config) throw new Error(`Unknown mission: ${missionId}`);

  const platforms = config.platformConfigs.map(item => createPlatform(item, manifests.platforms));
  const decorations = config.decorationConfigs.map(item => createDecoration(item, manifests.decorations));
  const objects = config.objectConfigs.map(item => ({
    ...createObject(item, manifests.objects),
    visible: item.kind !== 'apple-prop',
  }));
  const surfaces = platforms.flatMap(platform => platform.surfaces);

  return {
    id: config.id,
    type: config.id,
    length: config.length,
    tint: config.tint,
    spawn: config.spawn,
    introText: config.introText,
    objectiveText: config.objectiveText,
    platforms,
    decorations,
    objects,
    surfaces,
    props: JSON.parse(JSON.stringify(config.props)),
    friendSpawn: config.friendSpawn,
    speedMultiplier: 1,
  };
}

export const SEED_GROW_SECONDS = 2.6;
const INTERACT_RADIUS = 95;

export class MissionRuntime {
  constructor(mission, friend) {
    this.mission = mission;
    this.friend = friend;
    this.type = mission.type;
    this.events = [];
    this.completed = false;
    this.lastPrompt = '';
    this.exitTimer = 0;

    // apple-garden state
    this.hasSeed = false;
    this.planted = false;
    this.growTimer = 0;
    this.grown = false;
    this.appleCount = 0;

    this.emit('dialogue', {speaker: friend.name, text: mission.introText, duration: 4400});
    this.emit('objective', {text: mission.objectiveText});
  }

  update(dt, player, input) {
    if (this.completed) {
      this.exitTimer -= dt;
      return;
    }
    if (this.type === 'apple-garden') this.updateAppleGarden(dt, player, input);
    else if (this.type === 'dark-lanterns') this.updateDarkLanterns(player, input);
    else if (this.type === 'lost-toy') this.updateLostToy(player);
  }

  updateAppleGarden(dt, player, input) {
    const props = this.mission.props;
    let prompt = '';

    if (!this.hasSeed) {
      if (near(player, props.seed)) {
        this.hasSeed = true;
        props.seed.taken = true;
        this.emit('dialogue', {speaker: 'Çatpat', text: 'Küçük bir tohum buldum. Onu toprağa nazikçe ekeceğim.', duration: 3000});
      }
    } else if (!this.planted) {
      if (near(player, props.plot)) {
        prompt = 'Etkileşim: Tohumu ek';
        if (input.consume('interact')) {
          this.planted = true;
          this.growTimer = 0;
          prompt = '';
          this.emit('dialogue', {speaker: 'Çatpat', text: 'Tohum toprakta. Şimdi sabırla büyümesini bekleyeceğim.', duration: 3200});
        }
      }
    } else if (!this.grown) {
      this.growTimer += dt;
      if (this.growTimer >= SEED_GROW_SECONDS) {
        this.grown = true;
        for (const object of this.mission.objects) object.visible = true;
        this.emit('dialogue', {speaker: 'Porsuk', text: 'Bak! Fidan büyüdü, dallarında elmalar var!', duration: 3400});
      }
    } else {
      for (const object of this.mission.objects) {
        if (object.collected || object.kind !== 'apple-prop') continue;
        if (near(player, object)) {
          object.collected = true;
          this.appleCount += 1;
        }
      }
      const totalApples = this.mission.objects.filter(item => item.kind === 'apple-prop').length;
      if (this.appleCount >= totalApples && totalApples > 0) {
        if (near(player, props.basket)) {
          prompt = 'Etkileşim: Elmaları sepete bırak';
          if (input.consume('interact')) {
            this.finish('Teşekkürler dostum! Bahçemiz yine bereketli oldu — yalnız olmadığım için mutluyum.');
            prompt = '';
          }
        } else {
          prompt = 'Elmaları Porsuk’un sepetine götür';
        }
      }
    }
    this.setPrompt(prompt);
  }

  updateDarkLanterns(player, input) {
    let prompt = '';
    for (const lantern of this.mission.objects) {
      if (lantern.lit) continue;
      if (near(player, lantern)) {
        prompt = 'Etkileşim: Feneri yak';
        if (input.consume('interact')) {
          lantern.lit = true;
          this.emit('dialogue', {speaker: 'Çatpat', text: 'Bir fener daha yandı.', duration: 1800});
          prompt = '';
        }
        break;
      }
    }
    this.setPrompt(prompt);
    if (!prompt && this.mission.objects.every(item => item.lit)) {
      this.finish('Artık karanlıktan korkmuyorum. Işığı benimle paylaştığın için teşekkürler.');
    }
  }

  updateLostToy(player) {
    const toy = this.mission.objects[0];
    if (!toy.collected && near(player, toy)) {
      toy.collected = true;
      this.emit('dialogue', {speaker: 'Çatpat', text: 'Buldum! Hemen geri götürüyorum.', duration: 2200});
      this.finish('Topumu getirdin! Küçük olmam önemli değilmiş, sen yine de düşündün.');
    }
  }

  finish(friendLine) {
    this.completed = true;
    this.exitTimer = 2.6;
    this.setPrompt('');
    this.emit('dialogue', {speaker: this.friend.name, text: friendLine, duration: 3800});
    this.emit('complete', {});
  }

  setPrompt(text) {
    if (text === this.lastPrompt) return;
    this.lastPrompt = text;
    this.emit('prompt', {text});
  }

  emit(type, payload) {
    this.events.push({type, ...payload});
  }

  takeEvents() {
    return this.events.splice(0);
  }
}

function near(player, point) {
  const radius = point.radius ?? INTERACT_RADIUS;
  const dx = player.x - point.x;
  const dy = player.feetY - point.y;
  return dx * dx + dy * dy <= radius * radius;
}

export {segmentsFromPoints};
