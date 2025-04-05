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
      if (e.key.toLowerCase() === "w") {
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
      if (e.key.toLowerCase() === "w") {
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
  setupTouchControls() {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    document.getElementById("controls").style.display = isTouchDevice
      ? "flex"
      : "none";

    if (isTouchDevice) {
      ["btn-left", "btn-right", "btn-jump", "btn-attack", "btn-throw"].forEach(
        (id) => {
          const button = document.getElementById(id);
          if (button) {
            const key = id.toUpperCase().replace("BTN-", "");
            button.addEventListener("touchstart", () => (this[key] = true));
            button.addEventListener("touchend", () => (this[key] = false));
          }
        }
      );
    }
  }
}
