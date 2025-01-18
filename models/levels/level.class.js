class Level {
  enemies;
  clouds;
  backgroundObjects;
  key;
  poisonObjects;
  // traps;
  // endboss;
  level_end_x = 12595; // Setzen Sie die Länge des Levels bis kurz nach dem Endboss

  constructor(enemies, clouds, backgroundObjects, poisonObjects, key) {
    this.enemies = enemies || [];
    this.clouds = clouds || [];
    this.backgroundObjects = backgroundObjects || [];
    this.key = key || null;
    // this.traps = traps || [];
    // this.endboss = endboss || null;
    this.poisonObjects = poisonObjects || [];  
   
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