/**
 * Class representing the game loop.
 */ class GameLoop {
  /**
   * Creates an instance of GameLoop.
   * @param {Object} world - The world object.
   */
  constructor(world) {
    this.world = world;
    this.world.canvas.addEventListener(
      "click",
      this.handleMouseClick.bind(this)
    );
    this.running = false;
    this.loopID = null;
  }

  /**
   * Starts the game loop.
   */
  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    const gameLoop = () => {
      if (!this.running) {
        if (this.loopID) {
          cancelAnimationFrame(this.loopID);
        }
        return;
      }
      this.world.update();
      this.world.draw();
      this.world.enemies.forEach((enemy) => {
        if (typeof enemy.update === "function") {
          enemy.update(this.world.character);
        }
      });
      this.loopID = requestAnimationFrame(gameLoop);
    };
    this.loopID = requestAnimationFrame(gameLoop);
  }

  /**
   * Stops the game loop.
   */
  stop() {
    this.running = false;
    if (this.loopID) {
      cancelAnimationFrame(this.loopID);
      this.loopID = null;
    }
  }

  /**
   * Handles mouse click events on the canvas.
   * @param {MouseEvent} event - The mouse event.
   */
  handleMouseClick(event) {
    const rect = this.world.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ui = this.world.ui;
    if (
      x >= ui.quitButton.x &&
      x <= ui.quitButton.x + ui.quitButton.width &&
      y >= ui.quitButton.y &&
      y <= ui.quitButton.y + ui.quitButton.height
    ) {
    }
  }
}
