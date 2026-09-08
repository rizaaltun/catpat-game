// Companions replay the player's actual route. They never create colliders,
// affect puzzles, or interpolate directly across a gap the player did not cross.
export class CompanionTrail {
  constructor(spacing = 82) {
    this.spacing = spacing;
    this.members = [];
    this.samples = [];
    this.distance = 0;
  }
  reset(player) {
    this.distance = 0;
    this.samples = [this.sample(player)];
  }
  recruit(friend) {
    if (!this.members.some(item => item.id === friend.id)) this.members.push(friend);
  }
  sample(player) {
    const surface = player.grounded ? player.groundedSurface : null;
    const t = surface && surface.x2 !== surface.x1
      ? (player.x - surface.x1) / (surface.x2 - surface.x1) : null;
    return {x: player.x, y: player.feetY, facing: player.facing || 1,
      grounded: !!player.grounded, surface, t, distance: this.distance};
  }
  record(player) {
    if (!this.samples.length) { this.reset(player); return; }
    const last = this.samples.at(-1);
    const length = Math.hypot(player.x - last.x, player.feetY - last.y);
    // Respawns/teleports must not leave a diagonal ribbon across the world.
    if (length > 180) { this.reset(player); return; }
    if (length < 2 && last.grounded === player.grounded) return;
    this.distance += length;
    this.samples.push(this.sample(player));
    const keepDistance = this.spacing * Math.max(4, this.members.length + 2);
    while (this.samples.length > 2 && this.samples[1].distance < this.distance - keepDistance) this.samples.shift();
  }
  poses() {
    return this.members.map((friend, index) => {
      const target = this.distance - this.spacing * (index + 1);
      let a = this.samples[0];
      if (!a) return null;
      let b = a;
      for (const sample of this.samples) {
        if (sample.distance >= target) { b = sample; break; }
        a = sample; b = sample;
      }
      const f = a === b ? 0 : Math.max(0, Math.min(1, (target - a.distance) / (b.distance - a.distance)));
      let x = a.x + (b.x - a.x) * f;
      let y = a.y + (b.y - a.y) * f;
      // Keep feet attached when the sampled platform has moved since traversal.
      if (a.surface && a.surface === b.surface && a.t !== null && b.t !== null) {
        const t = a.t + (b.t - a.t) * f;
        x = a.surface.x1 + (a.surface.x2 - a.surface.x1) * t;
        y = a.surface.y1 + (a.surface.y2 - a.surface.y1) * t;
      }
      return {friend, x, y, facing: b.facing, grounded: a.grounded && b.grounded,
        visible: target >= (this.samples[0]?.distance ?? 0)};
    }).filter(Boolean);
  }
}
