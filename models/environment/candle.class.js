/**
 * Represents a candle object in the game environment.
 * @extends DrawableObject
 */
class Candle extends DrawableObject {
  img;
  x;
  y;
  width;
  height;

  /**
   * Creates a new Candle instance.
   * @param {number} x - The X position of the candle.
   */
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.candle;
    this.x = x;
    this.y = 200;
    this.width = 300;
    this.height = 300;
  }
}
