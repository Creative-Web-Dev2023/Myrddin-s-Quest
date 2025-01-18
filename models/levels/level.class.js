class Level {
  enemies;
  clouds;
  backgroundObjects;
  key;
  poisonObjects;
  traps;
  endboss;
  level_end_x = 5000;
  index;

  constructor(enemies, clouds, backgroundObjects, poisonObjects, key, traps, endboss, index) {
    this.enemies = enemies || [];
    this.clouds = clouds || [];
    this.backgroundObjects = backgroundObjects || [];
    this.traps = traps || [];
    this.key = key || null;
    this.poisonObjects = poisonObjects || [];  
    this.endboss = endboss || null;
    this.index = index || null;
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