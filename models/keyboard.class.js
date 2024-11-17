class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  ATTACK = false;
  THROW = false; // Initialisiere die THROW-Taste

  constructor() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.LEFT = true;
      }
      if (event.key === 'ArrowRight') {
        this.RIGHT = true;
      }
      if (event.key === 'ArrowUp') {
        this.UP = true;
      }
      if (event.key === 'ArrowDown') {
        this.DOWN = true;
      }
      if (event.key === ' ') {
        this.SPACE = true;
      }
      if (event.key === 'a' || event.key === 'A') {
        this.ATTACK = true;
      }
      if (event.key === 't' || event.key === 'T') {
        this.THROW = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowLeft') {
        this.LEFT = false;
      }
      if (event.key === 'ArrowRight') {
        this.RIGHT = false;
      }
      if (event.key === 'ArrowUp') {
        this.UP = false;
      }
      if (event.key === 'ArrowDown') {
        this.DOWN = false;
      }
      if (event.key === ' ') {
        this.SPACE = false;
      }
      if (event.key === 'a' || event.key === 'A') {
        this.ATTACK = false;
      }
      if (event.key === 't' || event.key === 'T') {
        this.THROW = false;
      }
    });
  }
}