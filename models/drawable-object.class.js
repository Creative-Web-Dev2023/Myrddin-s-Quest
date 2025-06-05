/**
 * Base class for all drawable objects in the game.
 */
class DrawableObject {
  constructor(x = 0, y = 0, width = 100, height = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Sets the health and poison status bars for the object.
   */
  setStatusBars(healthBar, poisonBar = null) {
    this.healthBar = healthBar;
    this.poisonBar = poisonBar;
  }

  /**
   * Loads an image for the object.
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
   * Draws the object on the given canvas context.
   */
  draw(ctx) {
    let img = this.img || this.imageCache?.[this.currentImageKey];
    if (img instanceof HTMLImageElement) {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    } else {
      console.warn(
        `[draw()] No image for ${this.constructor.name}:`,
        this.currentImageKey
      );
    }
  }
}
