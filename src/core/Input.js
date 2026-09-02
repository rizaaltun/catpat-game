export class Input {
  constructor(root=document){this.state={left:false,right:false,jump:false,focus:false,interact:false};this.pressed=new Set();this.bindKeyboard();this.bindTouch(root)}
  bindKeyboard(){const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ShiftLeft:'focus',ShiftRight:'focus',KeyE:'interact'};addEventListener('keydown',e=>{const key=map[e.code];if(key){e.preventDefault();if(!this.state[key])this.pressed.add(key);this.state[key]=true}});addEventListener('keyup',e=>{const key=map[e.code];if(key)this.state[key]=false});addEventListener('blur',()=>this.reset())}
  bindTouch(root){root.querySelectorAll('[data-input]').forEach(btn=>{const key=btn.dataset.input;const set=v=>{this.state[key]=v;btn.classList.toggle('is-active',v);if(v)this.pressed.add(key)};btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.setPointerCapture(e.pointerId);set(true)});['pointerup','pointercancel','lostpointercapture'].forEach(type=>btn.addEventListener(type,()=>set(false)))})}
  consume(key){const has=this.pressed.has(key);this.pressed.delete(key);return has}
  reset(){Object.keys(this.state).forEach(k=>this.state[k]=false);this.pressed.clear()}
  endFrame(){this.pressed.clear()}
}


