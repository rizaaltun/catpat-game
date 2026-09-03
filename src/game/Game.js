import {Player} from './Player.js';
import {LevelRuntime, objectRect} from './LevelRuntime.js';
import {LEVELS, createLevel} from './levels.js';

const CHARACTER_ROOT = './assets/characters/catpat/animation_v03/';
const PLATFORM_ROOT = './assets/environments/forest/platforms_v03/';
const DECORATION_ROOT = './assets/environments/forest/decorations_v02/';
const OBJECT_ROOT = './assets/gameplay/forest/objects_v03/';
const MECHANISM_ROOT = './assets/gameplay/forest/mechanisms_v04/';

export class Game {
  constructor(canvas, input, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.ui = ui;
    this.running = false;
    this.paused = false;
    this.debug = false;
    this.last = 0;
    this.acc = 0;
    this.step = 1 / 60;
    this.camera = {x: 0, y: 0};
    this.loopToken = 0;
    this.finishing = 0;
    this.assetsReady = this.loadAssets();

    addEventListener('keydown', event => {
      if (event.code === 'F2') this.debug = !this.debug;
      if (event.code === 'Escape' && this.running) this.ui.pause();
    });
  }

  async loadAssets() {
    const [characterManifest, platformManifest, decorationManifest, objectManifest, mechanismManifest] = await Promise.all([
      loadJson(`${CHARACTER_ROOT}animation_manifest.json`),
      loadJson(`${PLATFORM_ROOT}platform_manifest.json`),
      loadJson(`${DECORATION_ROOT}manifest.json`),
      loadJson(`${OBJECT_ROOT}manifest.json`),
      loadJson(`${MECHANISM_ROOT}manifest.json`),
    ]);
    this.characterManifest = characterManifest;
    this.manifests = {
      platforms: platformManifest,
      decorations: decorationManifest,
      objects: objectManifest,
      mechanisms: mechanismManifest,
    };

    const clip = characterManifest.clips;
    const run = await Promise.all(clip.run.frames.map(path => loadImage(`${CHARACTER_ROOT}${path}`)));
    const [idle, jumpStart, jumpApex, fall, land, celebrate] = await Promise.all([
      loadImage(`${CHARACTER_ROOT}${clip.idle.frames[0]}`),
      loadImage(`${CHARACTER_ROOT}${clip.jump.frames[0]}`),
      loadImage(`${CHARACTER_ROOT}${clip.jump.frames[1]}`),
      loadImage(`${CHARACTER_ROOT}${clip.jump.frames[2]}`),
      loadImage(`${CHARACTER_ROOT}${clip.jump.frames[3]}`),
      loadImage(`${CHARACTER_ROOT}${clip.celebrate.frames[0]}`),
    ]);
    this.frames = {
      idle,
      run,
      jumpStart,
      jumpApex,
      fall,
      land,
      celebrate,
      pivot: characterManifest.pivot,
      scale: characterManifest.displayScale,
      runFps: clip.run.fps,
    };

    const [platformImages, decorationImages, objectImages, spriteSheetImages, mechanismImages, background] = await Promise.all([
      loadImageMap(platformManifest.assets, PLATFORM_ROOT),
      loadImageMap(decorationManifest.assets, DECORATION_ROOT),
      loadImageMap(objectManifest.assets, OBJECT_ROOT),
      loadImageMap(objectManifest.spriteSheets || {}, OBJECT_ROOT),
      loadImageMap(mechanismManifest.assets, MECHANISM_ROOT),
      loadImage('./assets/environments/forest/backgrounds_v02/forest_valley.jpg'),
    ]);
    this.platformImages = platformImages;
    this.decorationImages = decorationImages;
    this.objectImages = {...objectImages, ...spriteSheetImages};
    this.mechanismImages = mechanismImages;
    this.background = background;
  }

  async start(id = 0) {
    const token = ++this.loopToken;
    await this.assetsReady;
    if (token !== this.loopToken) return;
    if (!LEVELS[id]?.implemented) throw new Error(`Bölüm ${id + 1} henüz oynanabilir değil`);

    this.level = createLevel(LEVELS[id], this.manifests);
    this.runtime = new LevelRuntime(this.level);
    this.player = new Player(
      this.level.spawn.x,
      this.level.spawn.y,
      this.characterManifest.collider,
    );
    this.camera = {x: 0, y: 0};
    this.acc = 0;
    this.finishing = 0;
    this.running = true;
    this.paused = false;
    this.input.reset();
    this.ui.showGame(this.level);
    this.handleEvents(this.runtime.takeEvents());
    this.last = performance.now();
    requestAnimationFrame(now => this.loop(now, token));
  }

  setPaused(value) {
    this.paused = value;
    if (!value && this.running) {
      this.last = performance.now();
      requestAnimationFrame(now => this.loop(now, this.loopToken));
    }
  }

  loop(now, token) {
    if (token !== this.loopToken || !this.running || this.paused) return;
    const frame = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.acc += frame;
    while (this.acc >= this.step) {
      this.update(this.step);
      this.acc -= this.step;
    }
    this.draw();
    requestAnimationFrame(time => this.loop(time, token));
  }

  update(dt) {
    if (this.finishing > 0) {
      this.finishing = Math.max(0, this.finishing - dt);
      this.player.state = 'celebrate';
      this.player.animTime += dt;
      if (this.finishing === 0) {
        this.running = false;
        this.ui.complete(this.level);
      }
      this.input.endFrame();
      return;
    }

    this.runtime.updateBeforePlayer(dt, this.player);
    this.player.update(dt, this.input, this.level);
    this.runtime.updateAfterPlayer(dt, this.player, this.input);
    this.handleEvents(this.runtime.takeEvents());

    this.camera.x += (
      clamp(this.player.x - 420, 0, this.level.length - this.canvas.width) - this.camera.x
    ) * (1 - Math.pow(0.001, dt));
    this.camera.y += (
      clamp(this.player.y - 390, 0, 165) - this.camera.y
    ) * (1 - Math.pow(0.004, dt));

    if (this.player.y > 900) this.resetPlayer();
    this.input.endFrame();
  }

  handleEvents(events) {
    for (const event of events) {
      if (event.type === 'objective') this.ui.setObjective(event.text);
      if (event.type === 'progress') this.ui.setProgress(event.current, event.total);
      if (event.type === 'prompt') this.ui.setPrompt(event.text);
      if (event.type === 'dialogue') this.ui.showDialogue(event.speaker, event.text, event.duration);
      if (event.type === 'checkpoint') this.ui.pulseProgress();
      if (event.type === 'complete') this.finishing = event.delay;
    }
  }

  resetPlayer() {
    this.player.x = this.level.respawn.x;
    this.player.y = this.level.respawn.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.grounded = false;
    this.player.groundedSurface = null;
  }

  draw() {
    const ctx = this.ctx;
    const camera = this.camera;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground(ctx, camera);
    for (const platform of this.level.platforms) this.drawPlatform(ctx, platform, camera);
    this.drawDecorations(ctx, camera, 'back');
    for (const object of this.level.objects) {
      if (object.kind !== 'ticket' && object.kind !== 'star') this.drawObject(ctx, object, camera);
    }
    this.player.draw(ctx, camera, this.frames);
    this.drawGateForeground(ctx, camera);
    this.drawDecorations(ctx, camera, 'front');
    for (const object of this.level.objects) {
      if (object.kind === 'ticket' || object.kind === 'star') this.drawObject(ctx, object, camera);
    }
    if (this.debug) this.drawDebug(ctx, camera);
  }

  drawBackground(ctx, camera) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const scale = Math.max(width / this.background.width, height / this.background.height) * 1.08;
    const drawWidth = this.background.width * scale;
    const drawHeight = this.background.height * scale;
    const maxShift = Math.max(0, drawWidth - width);
    const shift = Math.min(maxShift, camera.x * 0.06);
    ctx.drawImage(this.background, -shift, height - drawHeight, drawWidth, drawHeight);
  }

  drawDecorations(ctx, camera, layer) {
    for (const decoration of this.level.decorations) {
      if (decoration.layer !== layer || !this.isNearCamera(decoration.x, camera, 440)) continue;
      const image = this.decorationImages[decoration.asset];
      ctx.save();
      ctx.translate(decoration.x - camera.x, decoration.y - camera.y);
      ctx.rotate(decoration.rotation || 0);
      ctx.drawImage(
        image,
        -decoration.pivot[0] * decoration.scale,
        -decoration.pivot[1] * decoration.scale,
        image.width * decoration.scale,
        image.height * decoration.scale,
      );
      ctx.restore();
    }
  }

  drawGateForeground(ctx, camera) {
    for (const object of this.level.objects) {
      if (object.kind !== 'lift-gate' || !this.isNearCamera(object.x, camera, 390)) continue;
      const image = this.mechanismImages[object.asset];
      const splitX = object.metadata.solid.bounds[2];
      ctx.save();
      ctx.translate(object.x - camera.x, object.y - camera.y);
      ctx.drawImage(
        image,
        splitX, 0, image.width - splitX, image.height,
        -object.pivot[0] * object.scale + splitX * object.scale,
        -object.pivot[1] * object.scale,
        (image.width - splitX) * object.scale,
        image.height * object.scale,
      );
      ctx.restore();
    }
  }

  drawPlatform(ctx, platform, camera) {
    if (!this.isNearCamera(platform.x + 384 * platform.scale, camera, 560)) return;
    const image = this.platformImages[platform.asset];
    const canvas = this.manifests.platforms.canvas;
    ctx.drawImage(
      image,
      platform.x - camera.x,
      platform.y - camera.y,
      canvas.width * platform.scale,
      canvas.height * platform.scale,
    );
  }

  drawObject(ctx, object, camera) {
    if (object.collected || !this.isNearCamera(object.x, camera, 390)) return;
    const image = object.source === 'mechanism'
      ? this.mechanismImages[object.asset]
      : this.objectImages[object.asset];
    const bob = object.kind === 'ticket' || object.kind === 'star'
      ? Math.sin(this.runtime.time * 2.8 + object.bob) * 7
      : 0;
    const pulse = object.kind === 'checkpoint' && object.active
      ? 1 + Math.sin(this.runtime.time * 4.5) * 0.035
      : 1;
    ctx.save();
    if (object.metadata.frameCount) {
      const [frameW, frameH] = object.metadata.frameSize;
      const frameIndex = selectSpriteFrame(object, this.runtime.time);
      ctx.translate(object.x - camera.x, object.y - camera.y);
      ctx.drawImage(
        image,
        frameIndex * frameW, 0, frameW, frameH,
        -object.pivot[0] * object.scale, -object.pivot[1] * object.scale,
        frameW * object.scale, frameH * object.scale,
      );
      ctx.restore();
      return;
    }
    if (object.kind === 'lift-gate') {
      // Only the left post + doorway draw here (behind the player). The right
      // post draws again in drawGateForeground(), after the player, so the
      // character visibly passes behind it when walking through the gate.
      const panel = this.mechanismImages[object.metadata.panelAsset];
      const lift = object.openAmount * object.metadata.liftDistance * object.scale;
      const splitX = object.metadata.solid.bounds[2];
      ctx.translate(object.x - camera.x, object.y - camera.y);
      ctx.drawImage(
        panel,
        -object.pivot[0] * object.scale,
        -object.pivot[1] * object.scale - lift,
        panel.width * object.scale,
        panel.height * object.scale,
      );
      ctx.drawImage(
        image,
        0, 0, splitX, image.height,
        -object.pivot[0] * object.scale,
        -object.pivot[1] * object.scale,
        splitX * object.scale,
        image.height * object.scale,
      );
      ctx.restore();
      return;
    }
    if (object.drawMode === 'origin') {
      const motionPivot = object.metadata.motionPivot;
      if (motionPivot && object.rotation) {
        const pivotX = motionPivot[0] * object.scale;
        const pivotY = motionPivot[1] * object.scale;
        ctx.translate(object.x + pivotX - camera.x, object.y + pivotY - camera.y);
        ctx.rotate(object.rotation);
        ctx.drawImage(image, -pivotX, -pivotY, image.width * object.scale, image.height * object.scale);
      } else {
        ctx.drawImage(
          image,
          object.x - camera.x,
          object.y - camera.y,
          image.width * object.scale,
          image.height * object.scale,
        );
      }
    } else {
      const buttonPress = object.kind === 'pressure-button' || object.kind === 'crate-plate'
        ? object.pressed * object.metadata.pressedOffset * object.scale
        : 0;
      const motion = objectRenderMotion(object, this.runtime.time);
      ctx.translate(object.x - camera.x, object.y + bob + buttonPress - camera.y);
      ctx.translate(0, motion.y);
      ctx.rotate(motion.rotation);
      ctx.scale(pulse * motion.scaleX, pulse * motion.scaleY);
      ctx.drawImage(
        image,
        -object.pivot[0] * object.scale,
        -object.pivot[1] * object.scale,
        image.width * object.scale,
        image.height * object.scale,
      );
    }
    ctx.restore();
  }

  drawDebug(ctx, camera) {
    ctx.save();
    ctx.strokeStyle = '#ff3154';
    ctx.lineWidth = 3;
    for (const surface of this.level.surfaces) {
      ctx.beginPath();
      ctx.moveTo(surface.x1 - camera.x, surface.y1 - camera.y);
      ctx.lineTo(surface.x2 - camera.x, surface.y2 - camera.y);
      ctx.stroke();
    }

    const left = this.player.x - this.player.w / 2 - camera.x;
    const top = this.player.y - this.player.h / 2 - camera.y;
    ctx.strokeStyle = '#00e0ff';
    ctx.strokeRect(left, top, this.player.w, this.player.h);
    ctx.strokeStyle = '#ffe23b';
    ctx.beginPath();
    ctx.moveTo(this.player.x - 10 - camera.x, this.player.feetY - camera.y);
    ctx.lineTo(this.player.x + 10 - camera.x, this.player.feetY - camera.y);
    ctx.moveTo(this.player.x - camera.x, this.player.feetY - 10 - camera.y);
    ctx.lineTo(this.player.x - camera.x, this.player.feetY + 10 - camera.y);
    ctx.stroke();

    const crate = this.level.objects.find(object => object.kind === 'crate');
    if (crate) {
      const [x1, y1, x2, y2] = objectRect(crate, crate.metadata.solid.bounds);
      ctx.strokeStyle = '#ad4cff';
      ctx.strokeRect(x1 - camera.x, y1 - camera.y, x2 - x1, y2 - y1);
    }
    for (const gate of this.level.objects.filter(object => object.kind === 'lift-gate')) {
      const [x1, y1, x2, y2] = objectRect(gate, gate.metadata.solid.bounds);
      const lift = gate.openAmount * gate.metadata.liftDistance * gate.scale;
      ctx.strokeStyle = '#ff9f1c';
      ctx.strokeRect(x1 - camera.x, y1 - lift - camera.y, x2 - x1, y2 - y1);
    }
    ctx.restore();
  }

  isNearCamera(x, camera, margin) {
    return x >= camera.x - margin && x <= camera.x + this.canvas.width + margin;
  }
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function objectRenderMotion(object, time) {
  if (object.kind === 'mud') {
    const ripple = Math.sin(time * 3.2) * 0.018;
    return {scaleX: 1 + ripple, scaleY: 1 - ripple * 0.45, y: 0, rotation: 0};
  }
  if (object.kind === 'ticket') {
    return {scaleX: 1, scaleY: 1, y: 0, rotation: Math.sin(time * 2.8 + object.bob) * 0.07};
  }
  if (object.kind === 'star') {
    const sparkle = 1 + Math.sin(time * 5.2 + object.bob) * 0.055;
    return {scaleX: sparkle, scaleY: sparkle, y: 0, rotation: Math.sin(time * 2.1) * 0.045};
  }
  return {scaleX: 1, scaleY: 1, y: 0, rotation: 0};
}

// Real pivot-locked animation frames replace code-driven squash/stretch for
// the crate and mushroom sprite sheets (production_v06 spriteSheets).
export function selectSpriteFrame(object, time) {
  if (object.kind === 'crate') return crateFrameIndex(object);
  if (object.kind === 'mushroom') return mushroomFrameIndex(object, time);
  return 0;
}

export function crateFrameIndex(object) {
  const t = object.animationTime || 0;
  if (object.animationState === 'push') {
    if ((object.wobble || 0) > 0) return 2; // push-right
    return Math.floor(t * 9) % 2 === 0 ? 1 : 3; // push-left / push-left-small
  }
  if (object.animationState === 'settle') return t < 0.28 ? 4 : 5; // settle / idle-recover
  return 0; // idle
}

export function mushroomFrameIndex(object, time) {
  if (object.animationState === 'launch') {
    const t = object.animationTime || 0;
    if (t < 0.07) return 1; // anticipate
    if (t < 0.15) return 2; // compress
    if (t < 0.25) return 3; // release
    if (t < 0.42) return 4; // recover
    return 0;
  }
  return Math.sin(time * 2.4) > 0 ? 0 : 5; // idle breathing between both idle frames
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Asset manifest could not be loaded: ${path}`);
  return response.json();
}

async function loadImageMap(assets, root) {
  const entries = await Promise.all(Object.keys(assets).map(async asset =>
    [asset, await loadImage(`${root}${asset}`)]));
  return Object.fromEntries(entries);
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image could not be loaded: ${path}`));
    image.src = path;
  });
}
