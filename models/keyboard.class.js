class Keyboard {
  LEFT = false;
  RIGHT = false;
  JUMP = false;
  ATTACK = false;
  THROW = false;

  constructor() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  
    this.setupTouchControls();
  }

  handleKeyDown(e) {
    if (e.keyCode === 37) this.LEFT = true;
    if (e.keyCode === 39) this.RIGHT = true;
    if (e.keyCode === 38) this.JUMP = true;
    if (e.keyCode === 65) this.ATTACK = true; 
    if (e.keyCode === 68) this.THROW = true;   
  }

  handleKeyUp(e) {
    if (e.keyCode === 37) this.LEFT = false;
    if (e.keyCode === 39) this.RIGHT = false;
    if (e.keyCode === 38) this.JUMP = false;
    if (e.keyCode === 65) this.ATTACK = false;
    if (e.keyCode === 68) this.THROW = false;
  }

  setupTouchControls() {
   
    const btnLeft = document.getElementById('btnLeft');
    if (btnLeft) {
      btnLeft.ontouchstart = () => this.LEFT = true;
      btnLeft.ontouchend = () => this.LEFT = false;
    }

    
    const btnRight = document.getElementById('btnRight');
    if (btnRight) {
      btnRight.ontouchstart = () => this.RIGHT = true;
      btnRight.ontouchend = () => this.RIGHT = false;
    }

  
    const btnJump = document.getElementById('btnJump');
    if (btnJump) {
      btnJump.ontouchstart = () => this.JUMP = true;
      btnJump.ontouchend = () => this.JUMP = false;
    }

   
    const btnAttack = document.getElementById('btnAttack');
    if (btnAttack) {
      btnAttack.ontouchstart = () => this.ATTACK = true;
      btnAttack.ontouchend = () => this.ATTACK = false;
    }

  
    const btnThrow = document.getElementById('btnPoison') || document.getElementById('btnThrow');
    if (btnThrow) {
      btnThrow.ontouchstart = () => this.THROW = true;
      btnThrow.ontouchend = () => this.THROW = false;
    }
  }
}