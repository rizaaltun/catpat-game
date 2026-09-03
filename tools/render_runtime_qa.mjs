#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const moduleRoot = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
if (!moduleRoot) throw new Error('CODEX_PRIMARY_RUNTIME_NODE_MODULES is required');
const canvasModule = await import(pathToFileURL(resolve(moduleRoot, '@napi-rs/canvas/index.js')).href);
const {createCanvas, GlobalFonts, Image, loadImage} = canvasModule;

globalThis.Image = Image;
globalThis.addEventListener = () => {};
globalThis.requestAnimationFrame = () => 0;
globalThis.fetch = async requestPath => {
  const path = resolve(root, String(requestPath).replace(/^\.\//, ''));
  try {
    const data = await readFile(path);
    return {ok: true, json: async () => JSON.parse(data.toString('utf8'))};
  } catch {
    return {ok: false, json: async () => null};
  }
};

const {Game} = await import('../src/game/Game.js');
const {objectRect} = await import('../src/game/LevelRuntime.js');
const canvas = createCanvas(1280, 720);
const input = {
  state: {left: false, right: false, jump: false, focus: false, interact: false},
  consume: () => false,
  reset() {},
  endFrame() {},
};
const ui = {
  showGame() {},
  setObjective() {},
  setProgress() {},
  setPrompt() {},
  showDialogue() {},
  pulseProgress() {},
  complete() {},
  pause() {},
};
const game = new Game(canvas, input, ui);
await game.start(0);

const scenes = [];
await capture('Başlangıç / etki', 0, () => {
  setPlayer(410, 610, 'idle');
  const sign = game.level.decorations.find(item => item.id === 'repairable-sign');
  sign.rotation = -0.23;
});

await capture('Gap school / boşluk', 1900, () => {
  setPlayer(2400, 550, 'jump', -120);
});

await capture('Taş asansör', 3300, () => {
  const lift = game.level.platforms.find(item => item.id === 'stone-lift');
  const surface = lift.surfaces[0];
  setPlayer((surface.x1 + surface.x2) / 2, (surface.y1 + surface.y2) / 2, 'idle');
});

const gate = game.level.objects.find(item => item.kind === 'lift-gate');
gate.active = true;
for (let frame = 0; frame < 55; frame += 1) game.runtime.updateBeforePlayer(1 / 60, game.player);
await capture('Düğme / açılır kapı', 4900, () => {
  setPlayer(5480, 610, 'run');
});

await capture('Sallanan kütük', 6700, () => {
  setPlayer(7030, 380, 'idle');
});

game.runtime.cratePlaced = true;
game.runtime.cratePlate.active = true;
for (let frame = 0; frame < 100; frame += 1) game.runtime.updateBeforePlayer(1 / 60, game.player);
const crate = game.level.objects.find(item => item.kind === 'crate');
game.runtime.translateOwner(crate, 9650 - crate.x, 0);

await capture('Sandık / köprü', 9500, () => {
  const [crateLeft] = objectRect(crate, crate.metadata.solid.bounds);
  setPlayer(crateLeft - game.player.w / 2 - 18, 610, 'run');
});

await capture('Mantar / bilet', 10500, () => {
  setPlayer(10850, 610, 'idle');
});

await capture('Festival varışı', 13600, () => {
  setPlayer(14150, 462, 'celebrate');
});

const panelWidth = 640;
const panelHeight = 360;
const labelHeight = 42;
const sheet = createCanvas(panelWidth * scenes.length, panelHeight + labelHeight);
const ctx = sheet.getContext('2d');
ctx.fillStyle = '#17202a';
ctx.fillRect(0, 0, sheet.width, sheet.height);
const fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
GlobalFonts.registerFromPath(fontPath, 'QA Sans');
ctx.font = '17px "QA Sans"';
ctx.fillStyle = '#ffffff';
for (let index = 0; index < scenes.length; index += 1) {
  const scene = scenes[index];
  ctx.drawImage(scene.image, index * panelWidth, 0, panelWidth, panelHeight);
  ctx.fillText(scene.name, index * panelWidth + 14, panelHeight + 27);
}
await writeFile(resolve(root, 'qa-runtime-scenes.png'), sheet.toBuffer('image/png'));
await renderWorldDebug();
await renderAnimationQA();
const performanceResult = benchmarkRuntime();
console.log(
  `runtime visual QA: ${scenes.length} real Game.draw scenes + full-world debug slices + animation states OK; `
  + `draw p95 ${performanceResult.p95.toFixed(2)} ms (${performanceResult.fpsFloor.toFixed(0)} FPS floor)`,
);

async function capture(name, cameraX, setup) {
  setup();
  game.camera.x = cameraX;
  game.camera.y = 0;
  game.draw();
  const buffer = canvas.toBuffer('image/png');
  const index = scenes.length + 1;
  await writeFile(resolve(root, `qa-runtime-scene-${index}.png`), buffer);
  scenes.push({name, image: await loadImage(buffer)});
}

function setPlayer(x, feetY, state, vy = 0) {
  game.player.x = x;
  game.player.y = feetY - game.player.h / 2;
  game.player.vx = state === 'run' ? 250 : 0;
  game.player.vy = vy;
  game.player.state = state;
  game.player.animTime = 0.18;
}

async function renderWorldDebug() {
  const cameras = [0, 1200, 2400, 3600, 4800, 6000, 7200, 8400, 9600, 10800, 12000, 13200, 13920];
  const captures = [];
  game.debug = true;
  game.player.x = -10000;
  for (const cameraX of cameras) {
    game.camera.x = cameraX;
    game.camera.y = 0;
    game.draw();
    const buffer = canvas.toBuffer('image/png');
    await writeFile(resolve(root, `qa-world-debug-${cameraX}.png`), buffer);
    captures.push(await loadImage(buffer));
  }
  game.debug = false;

  const width = 512;
  const height = 288;
  const footer = 34;
  const columns = 4;
  const rows = Math.ceil(captures.length / columns);
  const debugSheet = createCanvas(width * columns, (height + footer) * rows);
  const debugCtx = debugSheet.getContext('2d');
  debugCtx.fillStyle = '#17202a';
  debugCtx.fillRect(0, 0, debugSheet.width, debugSheet.height);
  debugCtx.font = '15px "QA Sans"';
  debugCtx.fillStyle = '#ffffff';
  for (let index = 0; index < captures.length; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = column * width;
    const y = row * (height + footer);
    debugCtx.drawImage(captures[index], x, y, width, height);
    debugCtx.fillText(`kamera x=${cameras[index]}`, x + 12, y + height + 23);
  }
  await writeFile(resolve(root, 'qa-world-debug.png'), debugSheet.toBuffer('image/png'));
}

async function renderAnimationQA() {
  const mushroom = game.level.objects.find(item => item.kind === 'mushroom');
  const states = [
    {name: 'Karakter · idle', camera: 0, setup: () => setPlayer(410, 610, 'idle')},
    {name: 'Karakter · run', camera: 0, setup: () => setPlayer(410, 610, 'run')},
    {name: 'Karakter · land', camera: 0, setup: () => setPlayer(410, 610, 'land')},
    {name: 'Mantar · idle', camera: 10500, setup: () => setObjectState(mushroom, 'idle', 0)},
    {name: 'Mantar · compress', camera: 10500, setup: () => setObjectState(mushroom, 'launch', 0.1)},
    {name: 'Mantar · release', camera: 10500, setup: () => setObjectState(mushroom, 'launch', 0.2)},
    {name: 'Sandık · push', camera: 9300, setup: () => setCrateState('push', 0.05, 1)},
    {name: 'Sandık · settle', camera: 9300, setup: () => setCrateState('settle', 0.18, 1)},
  ];
  const shots = [];
  for (const state of states) {
    game.player.x = -10000;
    state.setup();
    game.camera.x = state.camera;
    game.camera.y = 0;
    game.draw();
    shots.push({name: state.name, image: await loadImage(canvas.toBuffer('image/png'))});
  }

  const width = 480;
  const height = 270;
  const footer = 34;
  const columns = 4;
  const output = createCanvas(width * columns, (height + footer) * 2);
  const outputCtx = output.getContext('2d');
  outputCtx.fillStyle = '#17202a';
  outputCtx.fillRect(0, 0, output.width, output.height);
  outputCtx.font = '15px "QA Sans"';
  outputCtx.fillStyle = '#ffffff';
  for (let index = 0; index < shots.length; index += 1) {
    const x = (index % columns) * width;
    const y = Math.floor(index / columns) * (height + footer);
    outputCtx.drawImage(shots[index].image, x, y, width, height);
    outputCtx.fillText(shots[index].name, x + 12, y + height + 23);
  }
  await writeFile(resolve(root, 'qa-animation-states-v05.png'), output.toBuffer('image/png'));

  function setObjectState(object, state, time) {
    object.animationState = state;
    object.animationTime = time;
  }

  function setCrateState(state, time, wobble) {
    crate.animationState = state;
    crate.animationTime = time;
    crate.wobble = wobble;
  }
}

function benchmarkRuntime() {
  const cameras = [0, 2400, 4800, 7200, 9600, 12000, 13920];
  game.debug = false;
  game.player.x = -10000;
  for (let index = 0; index < 42; index += 1) {
    game.camera.x = cameras[index % cameras.length];
    game.draw();
  }
  const samples = [];
  for (let index = 0; index < 280; index += 1) {
    game.camera.x = cameras[index % cameras.length];
    const started = performance.now();
    game.draw();
    game.ctx.getImageData(0, 0, 1, 1);
    samples.push(performance.now() - started);
  }
  samples.sort((a, b) => a - b);
  const p95 = samples[Math.floor(samples.length * 0.95)];
  if (p95 > 16.67) throw new Error(`render performance budget exceeded: p95=${p95.toFixed(2)}ms`);
  return {p95, fpsFloor: 1000 / p95};
}
