/**
 * Represents a drawable object in the game.
 */
class DrawableObject {
  /**
   * Creates an instance of DrawableObject.
   * @param {number} [x=0] - The x position of the object.
   * @param {number} [y=0] - The y position of the object.
   * @param {number} [width=100] - The width of the object.
   * @param {number} [height=100] - The height of the object.
   */
  constructor(x = 0, y = 0, width = 100, height = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.imageCache = {};
    this.currentImage = 0;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Loads an image for the object.
   * @param {string} path - The path to the image.
   */
  loadImage(path) {
    this.img.src = path;
  }

  /**
   * Loads multiple images into the image cache.
   * @param {string[]} images - An array of image paths.
   */
  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Plays an animation by cycling through a set of images.
   * @param {string[]} images - An array of image paths for the animation.
   */
  playAnimation(images) {
    if (!images?.length) return;
    this.img = this.imageCache[images[this.currentImage % images.length]];
    this.currentImage++;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Gets the collision box of the object.
   * @returns {Object} - The collision box with x, y, width, and height properties.
   */
  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }
}
