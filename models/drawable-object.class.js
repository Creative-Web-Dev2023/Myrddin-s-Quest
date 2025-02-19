/**
 * Class representing a drawable object.
 */
class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Loads an image for the object.
   * @param {string} path - The path to the image.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images for the object.
   * @param {string[]} images - The array of image paths to load.
   */
  loadImages(images) {
    if (!images || images.length === 0) {
      return;
    }
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
    this.img = this.imageCache[images[0]] || new Image();
  }

  /**
   * Plays an animation for the object.
   * @param {string[]} images - The array of image paths for the animation.
   */
  playAnimation(images) {
    if (images && images.length > 0) {
      let i = this.currentImage % images.length;
      this.img = this.imageCache[images[i]];
      this.currentImage++;
    }
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws the collision frame of the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Knight ||
      this instanceof Endboss ||
      this instanceof Snake ||
      this instanceof Door ||
      this instanceof PoisonObject ||
      this instanceof Key
    ) {
      ctx.beginPath();
      ctx.lineWidth = "4";
      if (this instanceof Character) {
        ctx.strokeStyle = "blue";
      } else if (this instanceof Knight) {
        ctx.strokeStyle = "red";
      } else if (this instanceof Endboss) {
        ctx.strokeStyle = "yellow";
      } else if (this instanceof Snake) {
        ctx.strokeStyle = "beige";
      } else if (this instanceof Door) {
        ctx.strokeStyle = "green";
      } else if (this instanceof PoisonObject) {
        ctx.strokeStyle = "black";
      } else if (this instanceof Key) {
        ctx.strokeStyle = "red";
      }
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  /**
   * Gets the collision box of the object.
   * @returns {Object} The collision box of the object.
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
