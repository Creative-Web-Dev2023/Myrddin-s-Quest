/**
 * Class representing a game level.
 */
class Level {
  enemies;
  clouds;
  door;
  snakes;
  backgroundObjects;
  poisonObjects;
  traps;
  level_end_x = 13395;

  /**
   * Creates an instance of Level.
   * @param {Enemy[]} enemies - The array of enemies in the level.
   * @param {Cloud[]} clouds - The array of clouds in the level.
   * @param {BackgroundObject[]} backgroundObjects - The array of background objects in the level.
   * @param {PoisonObject[]} poisonObjects - The array of poison objects in the level.
   * @param {Trap[]} traps - The array of traps in the level.
   */
  constructor(enemies, clouds, door, backgroundObjects, poisonObjects, traps) {
    // this.snakes = enemies.filter((e) => e instanceof Snake);
    this.snakes = enemies.filter((e, i) => {
      console.log(`Enemy ${i}:`, e);
      console.log(`Ist Snake?`, e instanceof Snake);
      return e instanceof Snake;
    });
    
    this.enemies = enemies.filter((e) => !(e instanceof Snake));
    this.clouds = clouds || [];
    this.door = door;
    this.backgroundObjects = backgroundObjects || [];
    this.poisonObjects = poisonObjects || [];
    this.traps = traps || [];
    this.endboss = this.enemies.find((e) => e instanceof Endboss) || null;
  }

  /**
   * Draws the level on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    this.backgroundObjects.forEach((bg) => bg.draw(ctx));
    this.clouds.forEach((cloud) => cloud.draw(ctx));
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.poisonObjects.forEach((poison) => {});
    this.traps.forEach((trap) => {
      if (trap.x >= camera_x && trap.x <= camera_x + canvas.width) {
        trap.draw(ctx);
      }
    });
  }
}