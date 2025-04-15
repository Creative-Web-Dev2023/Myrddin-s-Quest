class Keyboard {
  LEFT = false;
  RIGHT = false;
  JUMP = false;
  ATTACK = false;
  D = false;

  /**
   * Sets up keyboard controls for the game.
   * @param {Object} world - The game world object.
   */
  setupControls(world) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.LEFT = true;
      }
      if (e.key === "ArrowRight") {
        this.RIGHT = true;
      }
      if (e.key === "ArrowUp") {
        this.JUMP = true;
      }
      if (e.key.toLowerCase() === "a") {
        this.ATTACK = true;
      }
      if (e.key.toLowerCase() === "d" && !this.D) {
        this.D = true;
        world.character.throwPoisonBottle();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") {
        this.LEFT = false;
      }
      if (e.key === "ArrowRight") {
        this.RIGHT = false;
      }
      if (e.key === "ArrowUp") {
        this.JUMP = false;
      }
      if (e.key.toLowerCase() === "a") {
        this.ATTACK = false;
      }
      if (e.key.toLowerCase() === "d") {
        this.D = false;
      }
    });
  }

  /**
   * Sets up touch controls for the game.
   * This function checks if the device supports touch input and displays the controls accordingly.
   */
  setupTouchControls(world) {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    document.getElementById("controls").style.display = isTouch ? "flex" : "none";
    if (!isTouch) return;
    const buttons = {
      "btn-left": "LEFT",
      "btn-right": "RIGHT",
      "btn-jump": "JUMP",
      "btn-attack": "ATTACK",
      "btn-throw": "THROW"
    };
    for (const [id, key] of Object.entries(buttons)) {
      const btn = document.getElementById(id);
      if (!btn) continue;
      btn.addEventListener("touchstart", () => {
        this[key] = true;
        if (id === "btn-throw") {
          world.character.throwPoisonBottle();
        }
      }); 
      btn.addEventListener("touchend", () => {
        this[key] = false;
      });
    }
  }
  
  /**
   * Resets the keyboard state to its initial values.
   * This function is called when the game is restarted or when the player tries again.
   */
  reset() {
    this.LEFT = false;
    this.RIGHT = false;
    this.JUMP = false;
    this.ATTACK = false;
    this.D = false;
  }
  
}
