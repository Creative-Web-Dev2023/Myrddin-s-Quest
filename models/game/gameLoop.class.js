class GameLoop {
  constructor(world) {
    this.world = world;
    this.world.canvas.addEventListener(
      "click",
      this.handleMouseClick.bind(this)
    );
  }

  start() {
    const gameLoop = () => {
      this.world.update();
      this.world.draw();
      this.world.enemies.forEach((enemy) => {
        if (typeof enemy.update === "function") {
          enemy.update(this.world.character);
        }
      });
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

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
