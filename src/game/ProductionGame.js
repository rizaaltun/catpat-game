import {Game} from './Game.js';
import {createProductionBookMissionWorld, productionBookMissionReady} from './BookMissionArtGate.js';
import {BookMissionRuntime} from './BookMissionRuntime.js';
import {markMissionRecruitsHelped} from './BookMissionModel.js';
import {bookMissionStory} from '../story/BookStory.js';

const BOOK_ASSET_STATUS = './assets/production_v07/book_mission_asset_status.json';

export class ProductionGame extends Game {
  constructor(...args) {
    super(...args);
    this.availableBookCharacters = new Set();
    this.availableBookScenes = new Set();
    this.bookAssetStatus = null;
    const baseAssetsReady = this.assetsReady;
    this.assetsReady = baseAssetsReady.then(() => this.loadBookAssetStatus());
  }

  async loadBookAssetStatus() {
    const response = await fetch(BOOK_ASSET_STATUS);
    if (!response.ok) throw new Error(`Book mission asset status failed: ${response.status}`);
    const status = await response.json();
    this.bookAssetStatus = status;
    this.setBookCharacterAvailability(
      Object.entries(status.characters || {}).filter(([, value]) => value.runtimeReady).map(([id]) => id),
    );
    this.setBookSceneAvailability(
      Object.entries(status.scenes || {}).filter(([, value]) => value.runtimeReady).map(([id]) => id),
    );
    return status;
  }

  setBookCharacterAvailability(ids = []) {
    this.availableBookCharacters = new Set(ids);
  }

  setBookSceneAvailability(ids = []) {
    this.availableBookScenes = new Set(ids);
  }

  enterBookMission(eventId, afterDialogue = false) {
    if (this.mission) return false;
    const characters = [...this.availableBookCharacters];
    const scenes = [...this.availableBookScenes];
    const gate = productionBookMissionReady(eventId, characters, scenes);
    if (!gate.ready) {
      const missing = [...gate.missingCharacters, ...gate.missingScenes];
      throw new Error(`Book mission cannot enter before canonical art is ready: ${eventId} (${missing.join(', ')})`);
    }

    if (!afterDialogue && this.ui.showStory) {
      this.ui.showStory(
        bookMissionStory(eventId, 'before'),
        () => this.enterBookMission(eventId, true),
        'Göreve başla',
      );
      return true;
    }

    this.mainState = {
      x: this.player.x,
      y: this.player.y,
      respawn: {...this.level.respawn},
      cameraX: this.camera.x,
    };
    this.mission = createProductionBookMissionWorld(eventId, this.manifests, characters, scenes);
    this.missionRuntime = new BookMissionRuntime(eventId);
    this.player.x = this.mission.spawn.x;
    this.player.y = this.mission.spawn.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.grounded = false;
    this.player.groundedSurface = null;
    this.camera = {x: 0, y: 0};
    this.teleportFlash = 1;
    this.handleEvents(this.missionRuntime.takeEvents());
    return true;
  }

  handleEvents(events) {
    for (const event of events) {
      if (event.type === 'enter-book-mission') {
        this.enterBookMission(event.eventId);
        continue;
      }
      if (event.type === 'complete' && this.mission?.bookDescriptor) {
        if (this.ui.showStory) {
          this.ui.showStory(
            bookMissionStory(this.mission.id, 'after'),
            () => this.exitMission(),
            'Yola devam',
          );
        } else {
          this.exitMission();
        }
        continue;
      }
      super.handleEvents([event]);
    }
  }

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
