/**
 * Base class for all drawable objects in the game.
 */
class DrawableObject {
  /**
   * Creates a new DrawableObject.
   * @param {number} [x=0] - The X position.
   * @param {number} [y=0] - The Y position.
   * @param {number} [width=100] - The width.
   * @param {number} [height=100] - The height.
   */
  constructor(x = 0, y = 0, width = 100, height = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Sets the status bars for the object.
   * @param {StatusBar} healthBar
   * @param {StatusBar|null} [poisonBar=null]
   */
  setStatusBars(healthBar, poisonBar = null) {
    this.healthBar = healthBar;
    this.poisonBar = poisonBar;
  }

  /**
   * Loads an image into the object.
   * @param {HTMLImageElement} imageObject
   */
  loadImage(imageObject) {
    if (imageObject instanceof HTMLImageElement) {
      this.img = imageObject;
    } else {
      console.error(
        "loadImage expects an HTMLImageElement but got:",
        imageObject
      );
    }
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    let img = this.img || this.imageCache?.[this.currentImageKey];
    if (img instanceof HTMLImageElement) {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    } else {
      console.warn(
        `[draw()] Kein Bild für ${this.constructor.name}:`,
        this.currentImageKey
      );
    }
  }
}
