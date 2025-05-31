/**
 * Represents the tick icon shown when the key is collected.
 * @extends DrawableObject
 */
class TickIcon extends DrawableObject {
  /**
   * The image representing the tick icon.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * The x-coordinate position of the tick icon.
   * @type {number}
   */
  x;

  /**
   * The y-coordinate position of the tick icon.
   * @type {number}
   */
  y;

  /**
   * The width of the tick icon.
   * @type {number}
   */
  width;

  /**
   * The height of the tick icon.
   * @type {number}
   */
  height;

  /**
   * Initializes a new instance of the TickIcon class.
   * Sets the image, position, and size of the tick icon.
   */
  constructor() {
    super();
    this.img = LOADED_IMAGES.gameUI.tick_icon;
    this.x = 320;
    this.y = 20;
    this.width = 50;
    this.height = 50;
  }
}
