const LANDING_TOLERANCE = 8;

export class Player {
  constructor(x, y, collider = {}) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.w = collider.width ?? 68;
    this.h = collider.height ?? 102;
    this.grounded = false;
    this.groundedSurface = null;
    this.previousFeetY = this.feetY;
    this.facing = 1;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.animTime = 0;
    this.landTimer = 0;
    this.state = 'idle';
  }

  update(dt, input, world) {
    const wasGrounded = this.grounded;
    const focused = input.state.focus;
    const max = (focused ? 145 : 330) * (world.speedMultiplier ?? 1);
    const accel = this.grounded ? 1900 : 1150;
    const friction = this.grounded ? 2200 : 520;
    const axis = (input.state.right ? 1 : 0) - (input.state.left ? 1 : 0);

    if (axis) {
      this.vx = approach(this.vx, axis * max, accel * dt);
      this.facing = axis;
    } else {
      this.vx = approach(this.vx, 0, friction * dt);
    }

    if (input.consume('jump')) this.jumpBuffer = 0.13;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.grounded ? 0.11 : Math.max(0, this.coyote - dt);

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = -690;
      this.grounded = false;
      this.coyote = 0;
      this.jumpBuffer = 0;
      this.animTime = 0;
    }
    if (!input.state.jump && this.vy < 0) this.vy += 1650 * dt;
    this.vy = Math.min(this.vy + 1900 * dt, 1050);

    this.x = Math.max(this.w / 2, this.x + this.vx * dt);
    this.previousFeetY = this.feetY;
    this.moveY(dt, world.surfaces);

    if (!wasGrounded && this.grounded) {
      this.landTimer = 0.12;
      this.animTime = 0;
    } else {
      this.landTimer = Math.max(0, this.landTimer - dt);
    }

    if (!this.grounded) this.state = this.vy < 0 ? 'jump' : 'fall';
    else if (this.landTimer > 0) this.state = 'land';
    else if (Math.abs(this.vx) > 28) this.state = focused ? 'walk' : 'run';
    else this.state = 'idle';
    this.animTime += dt;
  }

  moveY(dt, surfaces) {
    const previousFeetY = this.feetY;
    this.y += this.vy * dt;
    const currentFeetY = this.feetY;
    this.grounded = false;
    this.groundedSurface = null;

    if (this.vy < 0) return;
    let landingY = Infinity;
    let landingSurface = null;
    for (const surface of surfaces) {
      const y = surfaceYAt(surface, this.x);
      if (y === null) continue;
      const crossed = previousFeetY <= y + LANDING_TOLERANCE && currentFeetY >= y;
      if (crossed && y < landingY) {
        landingY = y;
        landingSurface = surface;
      }
    }

    if (landingY < Infinity) {
      this.y = landingY - this.h / 2;
      this.vy = 0;
      this.grounded = true;
      this.groundedSurface = landingSurface;
    }
  }

  get feetY() {
    return this.y + this.h / 2;
  }

  draw(ctx, camera, frames) {
    const frame = this.selectFrame(frames);
    if (!frame) return;
    const pivot = frames.pivot;
    const scale = frames.scale;
    const screenX = this.x - camera.x;
    const feetY = this.feetY - camera.y;
    ctx.save();
    ctx.translate(screenX, feetY);
    ctx.scale(this.facing, 1);
    ctx.drawImage(
      frame,
      -pivot.x * scale,
      -pivot.y * scale,
      frame.width * scale,
      frame.height * scale,
    );
    ctx.restore();
  }

  selectFrame(frames) {
    if (!frames) return null;
    if (this.state === 'run' || this.state === 'walk') {
      const fps = this.state === 'walk' ? 8 : frames.runFps;
      return frames.run[Math.floor(this.animTime * fps) % frames.run.length];
    }
    if (this.state === 'jump') return this.vy < -220 ? frames.jumpStart : frames.jumpApex;
    if (this.state === 'fall') return frames.fall;
    if (this.state === 'land') return frames.land;
    if (this.state === 'celebrate') return frames.celebrate;
    return frames.idle || frames.run[0];
  }
}

export function surfaceYAt(surface, x) {
  const left = Math.min(surface.x1, surface.x2);
  const right = Math.max(surface.x1, surface.x2);
  if (x < left || x > right || left === right) return null;
  const t = (x - surface.x1) / (surface.x2 - surface.x1);
  return surface.y1 + (surface.y2 - surface.y1) * t;
}

const approach = (value, target, delta) => value < target
  ? Math.min(value + delta, target)
  : Math.max(value - delta, target);
