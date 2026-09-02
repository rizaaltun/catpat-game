export const LEVELS = [
  {
    id: 0,
    title: 'Çatpat Gibi Bir Gün',
    subtitle: 'Şenlik yolu açılıyor',
    objective: '3 şenlik biletini bul ve giriş masasına götür',
    theme: 'forest',
    length: 15200,
    targetMinutes: [6, 9],
    unlocked: true,
    implemented: true,
  },
  {id: 1, title: 'Dal Dal Üstüne', subtitle: 'Maymun ve Porsuk’un oyunu', objective: 'Arkadaşların kurduğu parkuru birlikte tamamla', theme: 'branches', length: 4300, implemented: false},
  {id: 2, title: 'Pıtpıt’ın Papatyaları', subtitle: 'Acele etmeden ilerle', objective: 'Papatyalara zarar vermeden Pıtpıt’a ulaş', theme: 'daisies', length: 4600, implemented: false},
];

// x/y always denotes the first walkable point, not the image corner. Adjacent
// surfaces overlap by 18–35 px where the art allows it, preventing visual seams.
const LEVEL01_PLATFORMS = [
  // 1 — Festival trail: movement, pace and the repairable sign.
  {id: 'start', asset: 'platform_long.png', x: 0, y: 610, scale: 0.92},
  {id: 'trail-step', asset: 'platform_step_stone.png', x: 620, y: 585, scale: 0.85},
  {id: 'trail-ramp', asset: 'platform_ramp.png', x: 740, y: 600, scale: 0.90},
  {id: 'flower-garden', asset: 'platform_medium.png', x: 1018, y: 452, scale: 0.84},
  {id: 'garden-short', asset: 'platform_short.png', x: 1428, y: 452, scale: 0.95},
  {id: 'garden-step', asset: 'platform_step_stone.png', x: 1590, y: 500, scale: 0.85},
  {id: 'trail-long', asset: 'platform_long.png', x: 1710, y: 540, scale: 0.88},
  {id: 'checkpoint-rock-1', asset: 'platform_rock.png', x: 2295, y: 520, scale: 0.85},
  {id: 'rest-garden', asset: 'platform_medium.png', x: 2450, y: 520, scale: 0.84},
  {id: 'cloud-launch', asset: 'platform_short.png', x: 2860, y: 500, scale: 0.95},

  // 2 — Cloud garden and a self-contained rising stone platform.
  {id: 'cloud-landing', asset: 'platform_medium.png', x: 3300, y: 420, scale: 0.84},
  {id: 'lift-step', asset: 'platform_step_stone.png', x: 3710, y: 405, scale: 0.85},
  {id: 'stone-lift', asset: 'platform_short.png', x: 3865, y: 520, scale: 0.95, motion: {axis: 'y', range: 170, speed: 0.76, phase: 1.3}},
  {id: 'lift-balcony', asset: 'platform_medium.png', x: 4050, y: 350, scale: 0.84},
  {id: 'balcony-step', asset: 'platform_step_stone.png', x: 4460, y: 405, scale: 0.85},
  {id: 'descent-step', asset: 'platform_short.png', x: 4595, y: 465, scale: 0.95},
  {id: 'descent-garden', asset: 'platform_medium.png', x: 4700, y: 515, scale: 0.84},
  {id: 'checkpoint-run-2', asset: 'platform_long.png', x: 5110, y: 555, scale: 0.88},

  // 3 — Ground button, lifting gate and rising stepping stones.
  {id: 'button-floor', asset: 'platform_medium.png', x: 5695, y: 610, scale: 0.84},
  {id: 'gate-floor', asset: 'platform_long.png', x: 6105, y: 610, scale: 0.92},
  {id: 'gate-ramp', asset: 'platform_ramp.png', x: 6725, y: 610, scale: 0.90},
  {id: 'rise-one', asset: 'platform_short.png', x: 6995, y: 500, scale: 0.95, motion: {axis: 'y', range: 82, speed: 1.05, phase: 0.2}},
  {id: 'rise-two', asset: 'platform_step_stone.png', x: 7165, y: 425, scale: 0.85, motion: {axis: 'y', range: 72, speed: 1.18, phase: 2.1}},
  {id: 'gate-lookout', asset: 'platform_medium.png', x: 7340, y: 405, scale: 0.84},
  {id: 'lookout-step', asset: 'platform_step_stone.png', x: 7750, y: 465, scale: 0.85},
  {id: 'checkpoint-run-3', asset: 'platform_long.png', x: 7870, y: 520, scale: 0.88},

  // 4 — Swaying log and the rhythm grove.
  {id: 'swing-landing', asset: 'platform_medium.png', x: 8620, y: 430, scale: 0.84},
  {id: 'rhythm-one', asset: 'platform_short.png', x: 9028, y: 470, scale: 0.95, motion: {axis: 'y', range: 78, speed: 1.15, phase: 0.3}},
  {id: 'rhythm-two', asset: 'platform_step_stone.png', x: 9190, y: 420, scale: 0.85, motion: {axis: 'y', range: 92, speed: 1.30, phase: 2.4}},
  {id: 'rhythm-bridge', asset: 'platform_bridge.png', x: 9360, y: 490, scale: 0.95},
  {id: 'mud-run', asset: 'platform_long.png', x: 9605, y: 610, scale: 0.92},
  {id: 'rhythm-ramp', asset: 'platform_ramp.png', x: 10225, y: 610, scale: 0.90},
  {id: 'rhythm-lift', asset: 'platform_short.png', x: 10505, y: 500, scale: 0.95, motion: {axis: 'y', range: 105, speed: 0.90, phase: 1.7, requires: 'rhythm-button'}},
  {id: 'checkpoint-garden-4', asset: 'platform_medium.png', x: 10660, y: 455, scale: 0.84},

  // 5 — Crate weight, mushroom high route and festival arrival.
  {id: 'crate-run', asset: 'platform_long.png', x: 11070, y: 540, scale: 0.88},
  {id: 'weight-stone', asset: 'platform_step_stone.png', x: 11655, y: 540, scale: 0.70},
  {id: 'crate-bridge', asset: 'platform_bridge.png', x: 11780, y: 480, scale: 0.88, initialOffsetY: 235, mechanism: 'crate-weight'},
  {id: 'mushroom-garden', asset: 'platform_medium.png', x: 12015, y: 480, scale: 0.84},
  {id: 'high-ticket', asset: 'platform_step_stone.png', x: 12160, y: 235, scale: 0.85},
  {id: 'return-step', asset: 'platform_step_stone.png', x: 12425, y: 510, scale: 0.85},
  {id: 'festival-ramp', asset: 'platform_ramp.png', x: 12545, y: 565, scale: 0.90},
  {id: 'festival-highway', asset: 'platform_long.png', x: 12825, y: 417, scale: 0.90},
  {id: 'festival-step', asset: 'platform_medium.png', x: 13430, y: 470, scale: 0.84},
  {id: 'festival-floor', asset: 'platform_long.png', x: 13840, y: 520, scale: 0.92},
];

const LEVEL01_DECORATIONS = [
  {id: 'start-tree', asset: 'decor_tree.png', x: 160, y: 610, scale: 0.64, layer: 'back'},
  {id: 'repairable-sign', asset: 'decor_sign.png', x: 505, y: 610, scale: 0.43, layer: 'front'},
  {id: 'start-grass', asset: 'decor_grass.png', x: 635, y: 585, scale: 0.23, layer: 'front'},
  {id: 'garden-flowers', asset: 'decor_flowers.png', x: 1120, y: 452, scale: 0.29, layer: 'front'},
  {id: 'garden-bush', asset: 'decor_bush.png', x: 1340, y: 452, scale: 0.36, layer: 'back'},
  {id: 'trail-bunting', asset: 'decor_bunting.png', x: 1930, y: 540, scale: 0.43, layer: 'back'},
  {id: 'rest-flowers', asset: 'decor_flowers.png', x: 2660, y: 520, scale: 0.26, layer: 'front'},
  {id: 'cloud-tree', asset: 'decor_tree.png', x: 3420, y: 420, scale: 0.50, layer: 'back'},
  {id: 'balcony-grass', asset: 'decor_grass.png', x: 4310, y: 350, scale: 0.24, layer: 'front'},
  {id: 'descent-bush', asset: 'decor_bush.png', x: 4880, y: 515, scale: 0.34, layer: 'back'},
  {id: 'button-flowers', asset: 'decor_flowers.png', x: 5740, y: 610, scale: 0.23, layer: 'front'},
  {id: 'gate-bunting', asset: 'decor_bunting.png', x: 6420, y: 610, scale: 0.43, layer: 'back'},
  {id: 'lookout-rocks', asset: 'decor_rocks.png', x: 7540, y: 405, scale: 0.25, layer: 'front'},
  {id: 'swing-tree', asset: 'decor_tree.png', x: 8730, y: 430, scale: 0.52, layer: 'back'},
  {id: 'rhythm-flowers', asset: 'decor_flowers.png', x: 9450, y: 490, scale: 0.22, layer: 'front'},
  {id: 'mud-flowers', asset: 'decor_flowers.png', x: 9700, y: 610, scale: 0.24, layer: 'front'},
  {id: 'crate-grass', asset: 'decor_grass.png', x: 11130, y: 540, scale: 0.22, layer: 'front'},
  {id: 'mushroom-bush', asset: 'decor_bush.png', x: 12310, y: 480, scale: 0.32, layer: 'back'},
  {id: 'festival-bunting', asset: 'decor_bunting.png', x: 13970, y: 520, scale: 0.48, layer: 'back'},
  {id: 'festival-tent', asset: 'decor_tent.png', x: 14580, y: 520, scale: 0.68, layer: 'back'},
  {id: 'festival-flowers', asset: 'decor_flowers.png', x: 14110, y: 520, scale: 0.28, layer: 'front'},
];

const LEVEL01_OBJECTS = [
  {id: 'ticket-1', asset: 'obj_ticket.png', kind: 'ticket', x: 1290, y: 330},
  {id: 'checkpoint-1', asset: 'obj_lantern.png', kind: 'checkpoint', x: 2600, y: 520},
  {id: 'moving-cloud', asset: 'obj_cloud.png', kind: 'moving-platform', surfaceX: 3020, surfaceY: 430, scale: 0.52, motion: {axis: 'x', range: 92, speed: 0.72, phase: 0.4}},
  {id: 'ticket-2', asset: 'obj_ticket.png', kind: 'ticket', x: 4290, y: 235},
  {id: 'checkpoint-2', asset: 'obj_lantern.png', kind: 'checkpoint', x: 5300, y: 555},
  {id: 'checkpoint-3', asset: 'obj_lantern.png', kind: 'checkpoint', x: 8050, y: 520},
  {id: 'mud', asset: 'obj_mud.png', kind: 'mud', x: 9870, y: 610, scale: 0.38},
  {id: 'checkpoint-4', asset: 'obj_lantern.png', kind: 'checkpoint', x: 10810, y: 455},
  {id: 'crate', asset: 'obj_crate.png', kind: 'crate', x: 11220, y: 540, pushLimits: [11150, 11725]},
  {id: 'mushroom', asset: 'obj_mushroom.png', kind: 'mushroom', x: 12210, y: 480},
  {id: 'ticket-3', asset: 'obj_ticket.png', kind: 'ticket', x: 12240, y: 130},
  {id: 'star-cloud', asset: 'obj_star.png', kind: 'star', x: 3160, y: 315},
  {id: 'star-rhythm', asset: 'obj_star.png', kind: 'star', x: 9460, y: 345},
  {id: 'star-festival', asset: 'obj_star.png', kind: 'star', x: 13230, y: 280},
];

const LEVEL01_MECHANISMS = [
  {id: 'gate-button', asset: 'pressure_button.png', kind: 'pressure-button', x: 5885, y: 610, scale: 0.18, targets: ['festival-gate'], latch: true},
  {id: 'festival-gate', asset: 'festival_gate_frame.png', kind: 'lift-gate', x: 6450, y: 610, scale: 0.55},
  {id: 'swing-platform', asset: 'swing_platform.png', kind: 'mechanism-platform', surfaceX: 8280, surfaceY: 445, scale: 0.42, motion: {axis: 'swing', range: 0.075, speed: 1.35, phase: 0.6}},
  {id: 'rhythm-button', asset: 'pressure_button.png', kind: 'pressure-button', x: 9900, y: 610, scale: 0.16, targets: ['rhythm-lift'], latch: true},
];

const LEVEL01_ZONES = [
  {id: 'cloud-garden', x: 2780, speaker: 'Çatpat', text: 'Bulutun ritmi var. Her boşluğu hızla değil, doğru anla geçebilirim.'},
  {id: 'stone-lift-zone', x: 3770, speaker: 'Orman', text: 'Taş platform aşağı iner, kısa bir an bekler ve yeniden yükselir.'},
  {id: 'gate-zone', x: 5570, speaker: 'Çatpat', text: 'Kapı ağır görünüyor… yakındaki yuvarlak düğme bir şeye bağlı olmalı.'},
  {id: 'swing-zone', x: 8130, speaker: 'Çatpat', text: 'Kütük sallanıyor. Bir an durup hareketini okuyayım.'},
  {id: 'rhythm-zone', x: 9650, speaker: 'Orman', text: 'İkinci düğme, ilerideki taşı uyandırır.'},
  {id: 'crate-zone', x: 10980, speaker: 'Çatpat', text: 'Bu kez hız yetmez. Sandığın ağırlığını doğru yere taşımam gerekiyor.'},
  {id: 'festival-zone', x: 13200, speaker: 'Çatpat', text: 'Müzik yakında! Son yol, yaptığım seçimlerin ardından açıldı.'},
];

export function createLevel(level, manifests) {
  if (level.id !== 0) throw new Error(`Level ${level.id + 1} is not implemented yet`);

  const platforms = LEVEL01_PLATFORMS.map(config => createPlatform(config, manifests.platforms));
  const decorations = LEVEL01_DECORATIONS.map(config => createDecoration(config, manifests.decorations));
  const objects = LEVEL01_OBJECTS.map(config => createObject(config, manifests.objects));
  const mechanisms = LEVEL01_MECHANISMS.map(config => createMechanism(config, manifests.mechanisms));
  const surfaces = [
    ...platforms.flatMap(platform => platform.surfaces),
    ...objects.flatMap(object => object.surfaces || []),
    ...mechanisms.flatMap(object => object.surfaces || []),
  ];

  return {
    ...level,
    spawn: {x: 135, y: 525},
    respawn: {x: 135, y: 525},
    goal: {x: 14580, y: 520, radius: 155},
    platforms,
    decorations,
    objects: [...objects, ...mechanisms],
    mechanisms,
    zones: LEVEL01_ZONES.map(zone => ({...zone, triggered: false})),
    surfaces,
    speedMultiplier: 1,
  };
}

export function createPlatform(config, manifest) {
  const metadata = manifest.assets[config.asset];
  if (!metadata?.walkable?.length) throw new Error(`Missing walkable metadata: ${config.asset}`);

  const [anchorX, anchorY] = metadata.walkable[0];
  const offsetY = config.initialOffsetY || 0;
  const originX = config.x - anchorX * config.scale;
  const originY = config.y + offsetY - anchorY * config.scale;
  const points = metadata.walkable.map(([x, y]) => ({
    x: originX + x * config.scale,
    y: originY + y * config.scale,
  }));
  const platform = {
    ...config,
    x: originX,
    y: originY,
    baseX: originX,
    baseY: originY - offsetY,
    currentOffsetY: offsetY,
    surfaces: [],
  };
  platform.surfaces = segmentsFromPoints(points, platform);
  return platform;
}

function createDecoration(config, manifest) {
  const metadata = manifest.assets[config.asset];
  if (!metadata) throw new Error(`Missing decoration metadata: ${config.asset}`);
  return {
    ...config,
    scale: config.scale ?? metadata.renderScale,
    pivot: metadata.pivot,
    rotation: 0,
    state: 'intact',
  };
}

function createObject(config, manifest) {
  const metadata = manifest.assets[config.asset];
  if (!metadata) throw new Error(`Missing gameplay-object metadata: ${config.asset}`);
  const scale = config.scale ?? metadata.renderScale;

  if (config.kind === 'moving-platform') {
    return createSurfaceObject(config, metadata, scale);
  }

  const object = {
    ...config,
    scale,
    pivot: metadata.pivot,
    metadata,
    collected: false,
    active: false,
    bob: config.id.length * 0.73,
    surfaces: [],
  };
  if (config.kind === 'crate') {
    const [[x1, y1], [x2, y2]] = metadata.walkable;
    const points = [
      {x: config.x + (x1 - metadata.pivot[0]) * scale, y: config.y + (y1 - metadata.pivot[1]) * scale},
      {x: config.x + (x2 - metadata.pivot[0]) * scale, y: config.y + (y2 - metadata.pivot[1]) * scale},
    ];
    object.surfaces = segmentsFromPoints(points, object);
  }
  return object;
}

function createMechanism(config, manifest) {
  const metadata = manifest.assets[config.asset];
  if (!metadata) throw new Error(`Missing mechanism metadata: ${config.asset}`);
  const scale = config.scale ?? metadata.renderScale;
  if (config.kind === 'mechanism-platform') {
    return createSurfaceObject({...config, source: 'mechanism'}, metadata, scale);
  }
  return {
    ...config,
    source: 'mechanism',
    scale,
    pivot: metadata.pivot,
    metadata,
    baseX: config.x,
    baseY: config.y,
    active: false,
    pressed: 0,
    openAmount: 0,
    surfaces: [],
  };
}

function createSurfaceObject(config, metadata, scale) {
  const [anchorX, anchorY] = metadata.walkable[0];
  const originX = config.surfaceX - anchorX * scale;
  const originY = config.surfaceY - anchorY * scale;
  const object = {
    ...config,
    scale,
    pivot: metadata.pivot,
    metadata,
    x: originX,
    y: originY,
    baseX: originX,
    baseY: originY,
    drawMode: 'origin',
    localWalkable: metadata.walkable.map(point => [...point]),
    rotation: 0,
    surfaces: [],
  };
  const points = metadata.walkable.map(([x, y]) => ({
    x: originX + x * scale,
    y: originY + y * scale,
  }));
  object.surfaces = segmentsFromPoints(points, object);
  return object;
}

function segmentsFromPoints(points, owner) {
  return points.slice(0, -1).map((point, index) => ({
    x1: point.x,
    y1: point.y,
    x2: points[index + 1].x,
    y2: points[index + 1].y,
    owner,
    dx: 0,
    dy: 0,
  }));
}
