class Level {
  enemies;
  clouds;
  backgroundObjects;
  poisonObjects;
  traps;
  level_end_x = 13395;

  constructor(enemies, clouds, backgroundObjects, poisonObjects, traps) {
    this.enemies = enemies || [];
    this.clouds = clouds || [];
    this.backgroundObjects = backgroundObjects || [];
    this.poisonObjects = poisonObjects || [];
    this.traps = traps || []; // Initialisiere die Fallen
  }

  draw(ctx) {
    this.backgroundObjects.forEach((bg) => bg.draw(ctx));
    this.clouds.forEach((cloud) => cloud.draw(ctx));
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.poisonObjects.forEach((poison) => {
      poison.drawFrame(ctx, camera_x);
    });
    this.traps.forEach((trap) => {
      if (trap.x >= camera_x && trap.x <= camera_x + canvas.width) {
        trap.draw(ctx);
      }
    });
  }
}
