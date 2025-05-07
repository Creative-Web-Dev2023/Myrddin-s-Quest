class Keyboard {
  LEFT = false;
  RIGHT = false;
  JUMP = false;
  ATTACK = false;
  D = false;

  setupControls(world) {
    // Tastatur-Events
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.LEFT = true;
      if (e.key === "ArrowRight") this.RIGHT = true;
      if (e.key === "ArrowUp") this.JUMP = true;
      if (e.key.toLowerCase() === "a") this.ATTACK = true;
      if (e.key.toLowerCase() === "d") this.handleThrow(world);
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") this.LEFT = false;
      if (e.key === "ArrowRight") this.RIGHT = false;
      if (e.key === "ArrowUp") this.JUMP = false;
      if (e.key.toLowerCase() === "a") this.ATTACK = false;
      if (e.key.toLowerCase() === "d") this.D = false;
    });
  }

  setupTouchControls(world) {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const container = document.querySelector(".btns-container");
    if (container) {
      container.style.display = isTouch ? "flex" : "none";
      container.style.pointerEvents = "auto"; // Hinzufügen
    }
    
  
    const buttons = {
      "btnLeft": "LEFT",
      "btnRight": "RIGHT",
      "btnJump": "JUMP",
      "btnAttack": "ATTACK",
      "btnPoison": "D"
    };

    for (const [id, key] of Object.entries(buttons)) {
      const btn = document.getElementById(id);
      if (!btn) continue;

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this[key] = true;
        if (id === "btnPoison") world.character.throwPoisonBottle();
      });

      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        this[key] = false;
      });
    }
  }

  handleThrow(world) {
    if (!this.D) {
      this.D = true;
      world.character.throwPoisonBottle();
    }
  }

  reset() {
    this.LEFT = false;
    this.RIGHT = false;
    this.JUMP = false;
    this.ATTACK = false;
    this.D = false;
  }
}