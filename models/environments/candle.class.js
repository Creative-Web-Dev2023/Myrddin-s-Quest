/**
 * Represents a candle object in the game environment.
 * @extends DrawableObject
 */
class Candle extends DrawableObject {
  /**
   * The image of the candle.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * The X position of the candle.
   * @type {number}
   */
  x;

  /**
   * The Y position of the candle.
   * @type {number}
   */
  y;

  /**
   * The width of the candle.
   * @type {number}
   */
  width;

  /**
   * The height of the candle.
   * @type {number}
   */
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
