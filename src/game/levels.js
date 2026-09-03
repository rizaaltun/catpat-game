export const LEVELS = [
  {
    id: 0,
    title: 'Çatpat Gibi Bir Gün',
    subtitle: 'Şenlik yolu açılıyor',
    objective: '3 şenlik biletini bul, yol boyunca nazik ol ve giriş masasına götür',
    theme: 'forest',
    length: 15200,
    targetMinutes: [6, 9],
    unlocked: true,
    implemented: true,
  },
  {id: 1, title: 'Dal Dal Üstüne', subtitle: 'Maymun ve Porsuk’un oyunu', objective: 'Arkadaşların kurduğu parkuru birlikte tamamla', theme: 'branches', length: 4300, implemented: false},
  {id: 2, title: 'Pıtpıt’ın Papatyaları', subtitle: 'Acele etmeden ilerle', objective: 'Papatyalara zarar vermeden Pıtpıt’a ulaş', theme: 'daisies', length: 4600, implemented: false},
];

// x/y always denotes the first walkable point, not the image corner. V06 layout:
// spacious real gaps (no rock/step-stone filler), one dominant mechanic per
// camera view, world length 15,200 px. See assets/production_v06/chapter01_layout_v06.json.
const LEVEL01_PLATFORMS = [
  // 01 — safe intro: single readable jump, repairable sign.
  {id: 'start', asset: 'platform_long.png', x: 0, y: 610, scale: 0.95},
  {id: 'garden-a', asset: 'platform_medium.png', x: 797, y: 610, scale: 0.90},

  // 02 — gap school: a confidence-building drop, then a real climb back up.
  {id: 'school-a', asset: 'platform_medium.png', x: 1418.5, y: 610, scale: 0.90},
  {id: 'school-b', asset: 'platform_medium.png', x: 2025, y: 660, scale: 0.90},
  {id: 'school-c', asset: 'platform_short.png', x: 2656.5, y: 600, scale: 0.95},

  // 03 — stone lift: vertical carry, no vine/rope/pulley.
  {id: 'lift-approach', asset: 'platform_medium.png', x: 2980, y: 600, scale: 0.90},
  {id: 'stone-lift', asset: 'platform_short.png', x: 3581.5, y: 510, scale: 0.90, motion: {axis: 'y', range: 90, speed: 0.8, phase: 0}},
  {id: 'lift-landing', asset: 'platform_medium.png', x: 3731.5, y: 400, scale: 0.90},
  {id: 'descent', asset: 'platform_medium.png', x: 4358, y: 560, scale: 0.90},

  // 04 — button + gate: single continuous runway, one cause-effect.
  {id: 'button-runway', asset: 'platform_long.png', x: 4969.5, y: 610, scale: 0.95},
  {id: 'gate-exit', asset: 'platform_long.png', x: 5576.5, y: 610, scale: 0.95},

  // 05 — swing crossing: full silhouette, single moving target, exits higher than it enters.
  {id: 'swing-approach', asset: 'platform_medium.png', x: 6393.5, y: 540, scale: 0.90},
  {id: 'swing-landing', asset: 'platform_medium.png', x: 7260, y: 480, scale: 0.90},

  // 06 — breathing room: quiet recovery beat, no mechanism, gentle descent.
  {id: 'rest-a', asset: 'platform_medium.png', x: 7876.5, y: 520, scale: 0.90},
  {id: 'rest-b', asset: 'platform_medium.png', x: 8493, y: 560, scale: 0.90},

  // 07 — crate/plate/bridge puzzle: crate has no decorative purpose.
  {id: 'crate-runway', asset: 'platform_long.png', x: 9124.5, y: 610, scale: 0.95},
  {id: 'crate-bridge', asset: 'platform_bridge.png', x: 9751.5, y: 610, scale: 0.88, initialOffsetY: 260, mechanism: 'crate-weight'},
  {id: 'crate-landing', asset: 'platform_medium.png', x: 10014.14, y: 605, scale: 0.90},

  // 08 — optional mushroom route: small bounce pad, main path stays readable.
  {id: 'mushroom-main', asset: 'platform_long.png', x: 10650.64, y: 610, scale: 0.95},
  {id: 'mushroom-upper', asset: 'platform_short.png', x: 10820, y: 310, scale: 0.78},
  {id: 'mushroom-landing', asset: 'platform_medium.png', x: 11457.64, y: 580, scale: 0.90},

  // 09 — festival finish: a real climb up to a hilltop view, safe and uncluttered.
  {id: 'pre-finish', asset: 'platform_long.png', x: 12084.14, y: 540, scale: 0.95},
  {id: 'festival-ramp', asset: 'platform_ramp.png', x: 12881.14, y: 540, scale: 0.90},
  {id: 'festival-floor', asset: 'platform_long.png', x: 13158.14, y: 392, scale: 0.95},
  {id: 'festival-floor-2', asset: 'platform_long.png', x: 13765.14, y: 350, scale: 0.95},
];

const LEVEL01_DECORATIONS = [
  {id: 'start-tree', asset: 'decor_tree.png', x: 120, y: 610, scale: 0.60, layer: 'back'},
  {id: 'repairable-sign', asset: 'decor_sign.png', x: 430, y: 610, scale: 0.42, layer: 'front'},
  {id: 'garden-flowers', asset: 'decor_flowers.png', x: 1000, y: 610, scale: 0.30, layer: 'front'},
  {id: 'school-bush', asset: 'decor_bush.png', x: 1650, y: 610, scale: 0.34, layer: 'back'},
  {id: 'school-grass', asset: 'decor_grass.png', x: 2750, y: 600, scale: 0.24, layer: 'front'},
  {id: 'lift-tree', asset: 'decor_tree.png', x: 3150, y: 600, scale: 0.46, layer: 'back'},
  {id: 'landing-grass', asset: 'decor_grass.png', x: 3950, y: 400, scale: 0.22, layer: 'front'},
  {id: 'gate-flowers', asset: 'decor_flowers.png', x: 5050, y: 610, scale: 0.26, layer: 'front'},
  {id: 'swing-tree', asset: 'decor_tree.png', x: 6550, y: 540, scale: 0.50, layer: 'back'},
  {id: 'rest-bush', asset: 'decor_bush.png', x: 8000, y: 520, scale: 0.34, layer: 'back'},
  {id: 'rest-flowers', asset: 'decor_flowers.png', x: 8600, y: 560, scale: 0.26, layer: 'front'},
  {id: 'crate-grass', asset: 'decor_grass.png', x: 9300, y: 610, scale: 0.22, layer: 'front'},
  {id: 'mushroom-bush', asset: 'decor_bush.png', x: 11050, y: 610, scale: 0.30, layer: 'back'},
  {id: 'ramp-grass', asset: 'decor_grass.png', x: 13000, y: 481, scale: 0.20, layer: 'front'},
  {id: 'festival-tent', asset: 'decor_tent.png', x: 13950, y: 350, scale: 0.62, layer: 'back'},
  {id: 'festival-flowers', asset: 'decor_flowers.png', x: 14200, y: 350, scale: 0.26, layer: 'front'},
];

const LEVEL01_OBJECTS = [
  {id: 'ticket-1', asset: 'obj_ticket.png', kind: 'ticket', x: 1700, y: 470},
  {id: 'checkpoint-1', asset: 'obj_lantern.png', kind: 'checkpoint', x: 4050, y: 400},
  {id: 'ticket-2', asset: 'obj_ticket.png', kind: 'ticket', x: 6600, y: 410},
  {id: 'checkpoint-2', asset: 'obj_lantern.png', kind: 'checkpoint', x: 7950, y: 520},
  {id: 'crate', asset: 'crate_push_sheet.png', kind: 'crate', x: 9260, y: 610, pushLimits: [9200, 9650]},
  {id: 'checkpoint-3', asset: 'obj_lantern.png', kind: 'checkpoint', x: 10200, y: 605},
  {id: 'mushroom', asset: 'mushroom_bounce_sheet.png', kind: 'mushroom', x: 10850, y: 610},
  {id: 'ticket-3', asset: 'obj_ticket.png', kind: 'ticket', x: 10900, y: 235},
];

const LEVEL01_MECHANISMS = [
  {id: 'gate-button', asset: 'crate_pressure_plate.png', kind: 'pressure-button', x: 5150, y: 610, scale: 0.18, targets: ['festival-gate'], latch: true},
  {id: 'festival-gate', asset: 'festival_gate_frame.png', kind: 'lift-gate', x: 5480, y: 610, scale: 0.55},
  {id: 'swing-platform', asset: 'swing_platform_complete.png', kind: 'mechanism-platform', surfaceX: 7030, surfaceY: 540, scale: 0.42, motion: {axis: 'swing', range: 0.075, speed: 1.35, phase: 0.6}},
  {id: 'crate-plate', asset: 'crate_pressure_plate.png', kind: 'crate-plate', x: 9650, y: 610, scale: 0.20, targets: ['crate-bridge']},
];

const LEVEL01_ZONES = [
  {id: 'gap-school-zone', x: 1900, speaker: 'Çatpat', text: 'Boşluk geniş görünüyor ama korkmama gerek yok — adımımı doğru zamanlarsam geçerim.'},
  {id: 'lift-zone', x: 3000, speaker: 'Orman', text: 'Taş platform kendi hızında çalışır. Onu zorlamak yerine ritmine güvenip beklemeyi öğreniyorum.'},
  {id: 'gate-zone', x: 4700, speaker: 'Çatpat', text: 'Kapı tek başına açılmıyor. Plakaya nazikçe basıp yardım edince yol birlikte açılıyor.'},
  {id: 'swing-zone', x: 6300, speaker: 'Çatpat', text: 'Kütük kendi salınımıyla ilerliyor. Ona ayak uydurmak için önce durup dinlemem gerekiyor.'},
  {id: 'rest-zone', x: 8000, speaker: 'Orman', text: 'Burada acele eden yok. Bazen durup nefes almak da yolun bir parçası.'},
  {id: 'crate-zone', x: 8900, speaker: 'Çatpat', text: 'Acele değil, doğru yer önemli. Sandığı plakanın tam üstüne nazikçe yerleştirmeliyim.'},
  {id: 'mushroom-zone', x: 10600, speaker: 'Orman', text: 'Küçük mantar benden ufak ama üstüne nazikçe basarsam beni yükseklere taşımaktan mutlu olur.'},
  {id: 'festival-zone', x: 12900, speaker: 'Çatpat', text: 'Müzik yakında! Yolun sonunda fark ettim: beni buraya getiren hızım değil, gösterdiğim nezaketti.'},
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
    goal: {x: 14150, y: 350, radius: 150},
    platforms,
    decorations,
    // Mechanisms (buttons/plates/gates) draw first so pushable/collectible
    // objects like the crate always render in front of the plate they sit on.
    objects: [...mechanisms, ...objects],
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

function lookupObjectMetadata(config, manifest) {
  const metadata = manifest.assets[config.asset] || manifest.spriteSheets?.[config.asset];
  if (!metadata) throw new Error(`Missing gameplay-object metadata: ${config.asset}`);
  return metadata;
}

function createObject(config, manifest) {
  const metadata = lookupObjectMetadata(config, manifest);
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
