import {Game} from './Game.js';
import {markMissionRecruitsHelped} from './BookMissionModel.js';

export class ProductionGame extends Game {
  exitMission() {
    if (!this.mission?.bookDescriptor) {
      super.exitMission();
      return;
    }
    if (!this.mainState) return;

    const recruits = markMissionRecruitsHelped(this.level.friends, this.mission.bookDescriptor);
    for (const friend of recruits) this.companions.recruit(friend);
    this.ui.setCompanions?.(this.companions.members);

    this.player.x = this.mainState.x;
    this.player.y = this.mainState.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.grounded = false;
    this.player.groundedSurface = null;
    this.level.respawn = this.mainState.respawn;
    this.camera = {x: this.mainState.cameraX, y: 0};
    this.teleportFlash = 1;
    this.mission = null;
    this.missionRuntime = null;
    this.mainState = null;
    this.ui.setObjective(this.runtime.tickets === this.runtime.totalTickets
      ? 'Dostlarınla birlikte festival çadırına ulaş'
      : this.level.objective);
    this.ui.setPrompt('');
  }
}
