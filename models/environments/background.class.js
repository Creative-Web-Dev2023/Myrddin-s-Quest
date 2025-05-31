/**
 * Represents a background object in the game environment.
 * @extends MovableObject
 */
class Background extends MovableObject {
  /**
   * The image of the background.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * The X position of the background.
   * @type {number}
   */
  x;

  /**
   * The width of the background.
   * @type {number}
   */
  width;

  /**
   * The height of the background.
   * @type {number}
   */
  height;

  /**
   * Creates a new Background instance.
   * @param {HTMLImageElement} imageObject - The image to use for the background.
   * @param {number} x - The X position of the background.
   */
  constructor(imageObject, x) {
    super();
    this.img = imageObject;
    this.x = x;
    this.width = 960;
    this.height = 540;
  }
}
