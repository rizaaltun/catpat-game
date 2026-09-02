import {Input} from './core/Input.js';import {Save} from './core/Save.js';import {Game} from './game/Game.js';import {UI} from './ui/UI.js';
const root=document.querySelector('#app'),canvas=document.querySelector('#game'),save=new Save(),input=new Input(root),ui=new UI(root,save),game=new Game(canvas,input,ui);ui.attach(game);addEventListener('contextmenu',e=>e.preventDefault());


