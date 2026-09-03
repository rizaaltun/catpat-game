const SIGN_RUSH_SPEED = 235;
const COLLECTIBLE_RADIUS = 88;

export class LevelRuntime {
  constructor(level) {
    this.level = level;
    this.time = 0;
    this.tickets = 0;
    this.totalTickets = level.objects.filter(object => object.kind === 'ticket').length;
    this.stars = 0;
    this.signWasTurned = false;
    this.signWasRepaired = false;
    this.carefulPass = false;
    this.cratePlaced = false;
    this.completed = false;
    this.goalReminderCooldown = 0;
    this.events = [];
    this.lastPrompt = '';

    this.sign = level.decorations.find(item => item.id === 'repairable-sign');
    this.crate = level.objects.find(item => item.kind === 'crate');
    this.cratePlate = level.objects.find(item => item.kind === 'crate-plate');
    this.mushroom = level.objects.find(item => item.kind === 'mushroom');
    this.checkpoints = level.objects.filter(item => item.kind === 'checkpoint');
    this.buttons = level.objects.filter(item => item.kind === 'pressure-button');
    this.pressables = [...this.buttons, ...(this.cratePlate ? [this.cratePlate] : [])];
    this.gates = level.objects.filter(item => item.kind === 'lift-gate');
    this.bridge = level.platforms.find(item => item.mechanism === 'crate-weight');
    this.motionOwners = [
      ...level.platforms.filter(item => item.motion),
      ...level.objects.filter(item => item.motion),
    ];

    // Backward-compatible handle used by the focused smoke tests.
    this.checkpoint = this.checkpoints[0];

    if (this.crate) {
      this.crate.wobble = 0;
      this.crate.animationState = 'idle';
      this.crate.animationTime = 0;
    }
    if (this.mushroom) {
      this.mushroom.animationState = 'idle';
      this.mushroom.animationTime = 0;
    }

    this.emit('objective', {text: level.objective});
    this.emit('progress', {current: 0, total: this.totalTickets});
    this.emit('dialogue', {
      speaker: 'Anne',
      text: 'Şenlik yolu uzun. Rüzgâr üç giriş biletini patikanın farklı yerlerine savurdu.',
      duration: 4700,
    });
  }

  updateBeforePlayer(dt, player) {
    this.time += dt;
    this.goalReminderCooldown = Math.max(0, this.goalReminderCooldown - dt);
    if (this.mushroom) {
      this.mushroom.cooldown = Math.max(0, (this.mushroom.cooldown || 0) - dt);
      this.mushroom.animationTime += dt;
      if (this.mushroom.animationState !== 'idle' && this.mushroom.animationTime >= 0.42) {
        this.mushroom.animationState = 'idle';
        this.mushroom.animationTime = 0;
      }
    }
    if (this.crate) {
      this.crate.animationTime += dt;
      this.crate.wobble = approach(this.crate.wobble || 0, 0, dt * 2.8);
      if (Math.abs(this.crate.wobble) < 0.02 && !this.cratePlaced) this.crate.animationState = 'idle';
    }

    for (const surface of this.level.surfaces) {
      surface.dx = 0;
      surface.dy = 0;
    }

    for (const owner of this.motionOwners) this.updateMotion(owner, dt, player);

    for (const button of this.pressables) {
      button.pressed = approach(button.pressed, button.active ? 1 : 0, dt * 6.5);
    }
    for (const gate of this.gates) {
      gate.openAmount = approach(gate.openAmount, gate.active ? 1 : 0, dt * 0.85);
    }

    if (this.bridge) {
      const target = this.cratePlaced ? 0 : this.bridge.initialOffsetY;
      const nextOffset = approach(this.bridge.currentOffsetY, target, 185 * dt);
      this.translateOwner(this.bridge, 0, nextOffset - this.bridge.currentOffsetY, player);
      this.bridge.currentOffsetY = nextOffset;
    }
  }

  updateAfterPlayer(dt, player, input) {
    if (this.completed) return;
    this.resolvePressureButtons(player);
    const gatePrompt = this.resolveGates(player);
    this.resolveCrate(dt, player, input);
    this.resolveMushroom(player);
    this.resolveCollectibles(player);
    const signPrompt = this.resolveSign(player, input);
    const cratePrompt = !this.cratePlaced && Math.abs(player.x - this.crate.x) < 195
      ? 'Sandığı plakaya it'
      : '';
    this.setPrompt(signPrompt || cratePrompt || gatePrompt);
    this.resolveCheckpoints(player);
    this.resolveZones(player);
    this.resolveGoal(player);
  }

  takeEvents() {
    return this.events.splice(0);
  }

  updateMotion(owner, dt, player) {
    const motion = owner.motion;
    const requirement = motion.requires
      ? this.level.objects.find(item => item.id === motion.requires)?.active
      : true;
    const wave = Math.sin(this.time * motion.speed + motion.phase);
    const desiredOffset = requirement
      ? wave * motion.range
      : (motion.axis === 'y' ? motion.range : 0);
    if (motion.axis === 'swing') {
      const nextRotation = requirement ? desiredOffset : 0;
      this.rotateOwner(owner, nextRotation, player);
      return;
    }
    const offset = motion.requires
      ? approach(owner.motionOffset || 0, desiredOffset, (motion.activationSpeed || 250) * dt)
      : desiredOffset;
    owner.motionOffset = offset;
    const nextX = owner.baseX + (motion.axis === 'x' ? offset : 0);
    const nextY = owner.baseY + (motion.axis === 'y' ? offset : 0);
    this.translateOwner(owner, nextX - owner.x, nextY - owner.y, player);
  }

  rotateOwner(owner, rotation, player = null) {
    const previous = owner.rotation || 0;
    if (Math.abs(previous - rotation) < 0.00001) return;
    owner.rotation = rotation;
    const pivot = owner.metadata.motionPivot || [owner.metadata.canvas?.[0] / 2 || 0, 0];
    const pivotX = owner.x + pivot[0] * owner.scale;
    const pivotY = owner.y + pivot[1] * owner.scale;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    for (let index = 0; index < owner.surfaces.length; index += 1) {
      const localA = owner.localWalkable[index];
      const localB = owner.localWalkable[index + 1];
      const ax = (localA[0] - pivot[0]) * owner.scale;
      const ay = (localA[1] - pivot[1]) * owner.scale;
      const bx = (localB[0] - pivot[0]) * owner.scale;
      const by = (localB[1] - pivot[1]) * owner.scale;
      const next = [
        pivotX + ax * cos - ay * sin,
        pivotY + ax * sin + ay * cos,
        pivotX + bx * cos - by * sin,
        pivotY + bx * sin + by * cos,
      ];
      const surface = owner.surfaces[index];
      const oldMidX = (surface.x1 + surface.x2) / 2;
      const oldMidY = (surface.y1 + surface.y2) / 2;
      surface.x1 = next[0];
      surface.y1 = next[1];
      surface.x2 = next[2];
      surface.y2 = next[3];
      surface.dx += (next[0] + next[2]) / 2 - oldMidX;
      surface.dy += (next[1] + next[3]) / 2 - oldMidY;
    }
    if (player?.groundedSurface?.owner === owner) {
      player.x += player.groundedSurface.dx;
      player.y += player.groundedSurface.dy;
    }
  }

  translateOwner(owner, dx, dy, player = null) {
    if (!dx && !dy) return;
    owner.x += dx;
    owner.y += dy;
    for (const surface of owner.surfaces || []) {
      surface.x1 += dx;
      surface.x2 += dx;
      surface.y1 += dy;
      surface.y2 += dy;
      surface.dx += dx;
      surface.dy += dy;
    }
    if (player?.groundedSurface?.owner === owner) {
      player.x += dx;
      player.y += dy;
    }
  }

  resolveCollectibles(player) {
    for (const object of this.level.objects) {
      if (object.collected || (object.kind !== 'ticket' && object.kind !== 'star')) continue;
      const bobY = object.y + Math.sin(this.time * 2.8 + object.bob) * 7;
      if (distanceSquared(player.x, player.y, object.x, bobY) > COLLECTIBLE_RADIUS ** 2) continue;
      object.collected = true;
      if (object.kind === 'ticket') {
        this.tickets += 1;
        this.emit('progress', {current: this.tickets, total: this.totalTickets});
        this.emit('dialogue', {
          speaker: 'Çatpat',
          text: this.tickets === this.totalTickets
            ? 'Üçü de burada! Şimdi giriş masasına ulaşabilirim.'
            : `Bilet ${this.tickets}/${this.totalTickets}. Patika uzuyor ama her bölümün başka bir ritmi var.`,
          duration: 2800,
        });
        if (this.tickets === this.totalTickets) {
          this.emit('objective', {text: 'Biletler tamam — festival çadırına ulaş'});
        }
      } else {
        this.stars += 1;
      }
    }
  }

  resolveSign(player, input) {
    if (!this.sign.evaluated && player.x >= this.sign.x - 8) {
      this.sign.evaluated = true;
      if (Math.abs(player.vx) > SIGN_RUSH_SPEED && !input.state.focus) {
        this.signWasTurned = true;
        this.sign.state = 'disturbed';
        this.sign.rotation = -0.23;
        this.emit('dialogue', {
          speaker: 'Çatpat',
          text: 'Vuu! ... Aa, tabela döndü. Böyle kalırsa gelenler ters yöne bakacak.',
          duration: 4300,
        });
      } else {
        this.carefulPass = true;
        this.emit('dialogue', {
          speaker: 'Çatpat',
          text: 'Yavaşlayınca tabelayı da yolu da aynı anda görebiliyorum.',
          duration: 3000,
        });
      }
    }

    if (this.sign.state !== 'disturbed') return '';
    if (Math.abs(player.x - this.sign.x) > 122 || Math.abs(player.feetY - this.sign.y) > 145) return '';
    if (input.consume('interact')) {
      this.signWasRepaired = true;
      this.sign.state = 'repaired';
      this.sign.rotation = 0;
      this.emit('dialogue', {
        speaker: 'Çatpat',
        text: 'Tamamdır! Hızım bende, yol yine herkesi doğru yere götürüyor.',
        duration: 3800,
      });
      return '';
    }
    return 'Etkileşim: Tabelayı düzelt';
  }

  resolvePressureButtons(player) {
    for (const button of this.buttons) {
      const horizontalRadius = (button.metadata.trigger.bounds[2] - button.metadata.trigger.bounds[0])
        * button.scale * 0.52;
      const standing = player.grounded
        && Math.abs(player.x - button.x) <= horizontalRadius
        && Math.abs(player.feetY - button.y) <= 105;
      const nextActive = button.latch ? button.active || standing : standing;
      if (nextActive === button.active) continue;
      button.active = nextActive;
      for (const targetId of button.targets || []) {
        const target = this.level.objects.find(item => item.id === targetId)
          || this.level.platforms.find(item => item.id === targetId);
        if (target) target.active = nextActive;
      }
      if (nextActive) {
        this.emit('dialogue', {
          speaker: 'Çatpat',
          text: 'Tık! Plaka aşağı indi; büyük kapı yukarı kalkıyor.',
          duration: 3200,
        });
        this.emit('mechanism', {id: button.id, active: true});
      }
    }
  }

  resolveGates(player) {
    for (const gate of this.gates) {
      if (gate.openAmount >= 0.82) continue;
      const [left, top, right, bottom] = objectRect(gate, gate.metadata.solid.bounds);
      const lift = gate.openAmount * gate.metadata.liftDistance * gate.scale;
      const gateRect = [left, top - lift, right, bottom - lift];
      const playerRect = [
        player.x - player.w / 2,
        player.y - player.h / 2,
        player.x + player.w / 2,
        player.feetY,
      ];
      if (!rectsOverlap(playerRect, gateRect)) continue;
      if (player.vx >= 0) player.x = left - player.w / 2 - 0.5;
      else player.x = right + player.w / 2 + 0.5;
      player.vx = 0;
      return 'Kapı kapalı — yakındaki yuvarlak düğmeye bas';
    }
    return '';
  }

  resolveCrate(dt, player, input) {
    if (!this.crate || this.cratePlaced) return;
    const [left, top, right, bottom] = objectRect(this.crate, this.crate.metadata.solid.bounds);
    const playerRect = [
      player.x - player.w / 2,
      player.y - player.h / 2,
      player.x + player.w / 2,
      player.feetY,
    ];
    if (!rectsOverlap(playerRect, [left, top, right, bottom])) return;

    const direction = player.x < this.crate.x ? 1 : -1;
    const pushing = direction > 0 ? input.state.right : input.state.left;
    if (pushing) {
      const proposed = clamp(
        this.crate.x + direction * Math.max(85, Math.abs(player.vx) * 0.68) * dt,
        this.crate.pushLimits[0],
        this.crate.pushLimits[1],
      );
      this.translateOwner(this.crate, proposed - this.crate.x, 0);
      if (this.crate.animationState !== 'push') {
        this.crate.animationState = 'push';
        this.crate.animationTime = 0;
      }
      this.crate.wobble = direction;
    }

    const [nextLeft, , nextRight] = objectRect(this.crate, this.crate.metadata.solid.bounds);
    player.x = direction > 0
      ? nextLeft - player.w / 2 - 0.5
      : nextRight + player.w / 2 + 0.5;

    if (!this.cratePlate) return;
    const crateRect = objectRect(this.crate, this.crate.metadata.solid.bounds);
    const plateRect = objectRect(this.cratePlate, this.cratePlate.metadata.trigger.bounds);
    if (!rectsOverlap(crateRect, plateRect)) return;

    this.cratePlaced = true;
    this.cratePlate.active = true;
    this.crate.animationState = 'settle';
    this.crate.animationTime = 0;
    this.crate.wobble = 1;
    this.emit('dialogue', {
      speaker: 'Çatpat',
      text: 'Sandık plakaya oturdu. Köprü yükseliyor!',
      duration: 3600,
    });
    this.emit('objective', {text: this.tickets === this.totalTickets ? 'Festival çadırına ulaş' : 'Kalan şenlik biletlerini bul'});
  }

  resolveMushroom(player) {
    if (!this.mushroom || this.mushroom.cooldown > 0) return;
    const bounds = objectRect(this.mushroom, this.mushroom.metadata.trigger.bounds);
    const withinX = player.x >= bounds[0] && player.x <= bounds[2];
    const bounceY = bounds[1] + 8;
    const crossedTop = player.previousFeetY <= bounceY + 16 && player.feetY >= bounceY - 4;
    const walkedIntoBase = player.grounded && Math.abs(player.x - this.mushroom.x) < 43;
    if (!withinX || (!crossedTop && !walkedIntoBase)) return;

    if (crossedTop) player.y = bounceY - player.h / 2;
    player.vy = -1120;
    player.grounded = false;
    player.groundedSurface = null;
    player.state = 'jump';
    player.animTime = 0;
    this.mushroom.cooldown = 0.55;
    this.mushroom.animationState = 'launch';
    this.mushroom.animationTime = 0;
  }

  resolveCheckpoints(player) {
    for (const checkpoint of this.checkpoints) {
      if (checkpoint.active) continue;
      if (Math.abs(player.x - checkpoint.x) > 82 || Math.abs(player.feetY - checkpoint.y) > 145) continue;
      checkpoint.active = true;
      this.level.respawn = {x: checkpoint.x, y: checkpoint.y - player.h / 2};
      this.emit('dialogue', {
        speaker: 'Yol Feneri',
        text: 'Işığım seni hatırladı. Düşersen bu noktadan devam edeceksin.',
        duration: 3300,
      });
      this.emit('checkpoint', {id: checkpoint.id});
    }
  }

  resolveZones(player) {
    for (const zone of this.level.zones) {
      if (zone.triggered || player.x < zone.x) continue;
      zone.triggered = true;
      this.emit('dialogue', {speaker: zone.speaker, text: zone.text, duration: 3600});
    }
  }

  resolveGoal(player) {
    const goal = this.level.goal;
    if (distanceSquared(player.x, player.feetY, goal.x, goal.y) > goal.radius ** 2) return;
    if (this.tickets < this.totalTickets) {
      if (this.goalReminderCooldown === 0) {
        this.emit('dialogue', {
          speaker: 'Çatpat',
          text: `Giriş kutusunda ${this.totalTickets - this.tickets} bilet hâlâ eksik. Son fenerden dönüp bulabilirim.`,
          duration: 3200,
        });
        this.goalReminderCooldown = 3.4;
      }
      return;
    }

    this.completed = true;
    this.setPrompt('');
    const noticedImpact = this.carefulPass || this.signWasRepaired;
    this.emit('dialogue', {
      speaker: 'Anne',
      text: noticedImpact
        ? 'Biletler tamam, yol da hazır. Enerjin uzun yolu hem hızlı hem özenli yaptı!'
        : 'Biletler tamam. Uzun yolun sonunda hızının bıraktığı küçük izleri de fark ettin.',
      duration: 4200,
    });
    this.emit('complete', {delay: 4.3});
  }

  setPrompt(text) {
    if (text === this.lastPrompt) return;
    this.lastPrompt = text;
    this.emit('prompt', {text});
  }

  emit(type, payload) {
    this.events.push({type, ...payload});
  }
}

export function objectRect(object, bounds) {
  const [left, top, right, bottom] = bounds;
  const [pivotX, pivotY] = object.pivot;
  return [
    object.x + (left - pivotX) * object.scale,
    object.y + (top - pivotY) * object.scale,
    object.x + (right - pivotX) * object.scale,
    object.y + (bottom - pivotY) * object.scale,
  ];
}

export function rectsOverlap(a, b) {
  return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
}

const distanceSquared = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const approach = (value, target, delta) => value < target
  ? Math.min(value + delta, target)
  : Math.max(value - delta, target);
