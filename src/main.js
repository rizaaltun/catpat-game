import {Input} from './core/Input.js';
import {Save} from './core/Save.js';
import {ProductionGame} from './game/ProductionGame.js';
import {UI} from './ui/UI.js';

const root = document.querySelector('#app');
const canvas = document.querySelector('#game');
const save = new Save();
const input = new Input(root);
const ui = new UI(root, save);
const game = new ProductionGame(canvas, input, ui);
ui.attach(game);
addEventListener('contextmenu', event => event.preventDefault());
addEventListener('blur', () => { if (game.running && !game.paused) ui.pause(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.running && !game.paused) ui.pause();
});

// Local browser QA only. Never expose test controls on a public deployment.
if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
    && new URLSearchParams(location.search).get('qa') === '1') {
  window.__CATPAT_QA__ = {game, ui, input, save};
}
