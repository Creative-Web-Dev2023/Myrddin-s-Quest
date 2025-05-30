class Keyboard {
  LEFT = false;
  RIGHT = false;
  JUMP = false;
  D = false;

  /**
   * Sets up keyboard controls for the game.
   * @param {Object} world - The game world object.
   */
  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.LEFT = true;
      }
      if (e.key === 'ArrowRight') {
        this.RIGHT = true;
      }
      if (e.key === 'ArrowUp') {
        this.JUMP = true;
      }

      if (e.key.toLowerCase() === 'd' && !this.D) {
        this.D = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') {
        this.LEFT = false;
      }
      if (e.key === 'ArrowRight') {
        this.RIGHT = false;
      }
      if (e.key === 'ArrowUp') {
        this.JUMP = false;
      }

      if (e.key.toLowerCase() === 'd') {
        this.D = false;
      }
    });
  }

  reset() {
    this.LEFT = false;
    this.RIGHT = false;
    this.JUMP = false;
    this.D = false;
  }

  linkButtonsToPressEvents() {
    document.getElementById('btn_left').addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.LEFT = true;
    });

    document.getElementById('btn_left').addEventListener('touchend', (e) => {
      e.preventDefault();
      this.LEFT = false;
    });

    document.getElementById('btn_right').addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.RIGHT = true;
    });

    document.getElementById('btn_right').addEventListener('touchend', (e) => {
      e.preventDefault();
      this.RIGHT = false;
    });

    document.getElementById('btn_up').addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.JUMP = true;
    });

    document.getElementById('btn_up').addEventListener('touchend', (e) => {
      e.preventDefault();
      this.JUMP = false;
    });

    document.getElementById('btn_space').addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.SPACE = true;
    });

    document.getElementById('btn_space').addEventListener('touchend', (e) => {
      e.preventDefault();
      this.SPACE = false;
    });

    document.getElementById('btn_space').addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.D = true;
    });

    document.getElementById('btn_space').addEventListener('touchend', (e) => {
      e.preventDefault();
      this.D = false;
    });
  }
}