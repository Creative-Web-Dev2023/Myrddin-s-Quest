/**
 * Class for managing keyboard and touch controls.
 */
class Keyboard {
  LEFT = false;
  RIGHT = false;
  JUMP = false;
  D = false;
  A = false; // <-- Attack-Taste

  /**
   * Initializes keyboard controls for the game.
   * Adds event listeners for key presses.
   */
  setupControls() {
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
      if (e.key.toLowerCase() === "d" && !this.D) {
        this.D = true;
      }
      if (e.key.toLowerCase() === "a" && !this.A) {
        this.A = true;
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
      if (e.key.toLowerCase() === "d") {
        this.D = false;
      }
      if (e.key.toLowerCase() === "a") {
        this.A = false;
      }
    });
  }

  /**
   * Resets all control flags to false.
   */
  reset() {
    this.LEFT = false;
    this.RIGHT = false;
    this.JUMP = false;
    this.D = false;
    this.A = false;
  }

  /**
   * Links touch buttons to the corresponding control events.
   * Adds event listeners for touchstart and touchend.
   */
  linkButtonsToPressEvents() {
    document
      .getElementById("arrow_left")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.LEFT = true;
      });

    document.getElementById("arrow_left").addEventListener("touchend", (e) => {
      e.preventDefault();
      this.LEFT = false;
    });

    document
      .getElementById("arrow-right")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.RIGHT = true;
      });

    document.getElementById("arrow-right").addEventListener("touchend", (e) => {
      e.preventDefault();
      this.RIGHT = false;
    });

    document.getElementById("arrow_up").addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.JUMP = true;
    });

    document.getElementById("arrow_up").addEventListener("touchend", (e) => {
      e.preventDefault();
      this.JUMP = false;
    });

    document
      .getElementById("throw_poison")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.D = true;
      });

    document
      .getElementById("throw_poison")
      .addEventListener("touchend", (e) => {
        e.preventDefault();
        this.D = false;
      });

    // Optional: Touch-Button für Attacke, falls vorhanden
    const attackBtn = document.getElementById("attack");
    if (attackBtn) {
      attackBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.A = true;
      });
      attackBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.A = false;
      });
    }
  }
}
