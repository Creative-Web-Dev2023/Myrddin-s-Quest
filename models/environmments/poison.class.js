/**
 * Class representing a Poison object.
 * @extends DrawableObject
 */
class PoisonObject extends DrawableObject {
  IMAGES_POISON = [
    "img/poison/1.png",
    "img/poison/2.png",
    "img/poison/3.png",
    "img/poison/4.png",
    "img/poison/5.png",
    "img/poison/6.png",
    "img/poison/7.png",
    "img/poison/8.png",
  ];

  isActive = true;

  /**
   * Creates an instance of PoisonObject.
   * @param {number} x - The x position of the poison object.
   * @param {number} y - The y position of the poison object.
   * @param {number} width - The width of the poison object.
   * @param {number} height - The height of the poison object.
   */
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImages(this.IMAGES_POISON);
    this.animate();
  }

  /**
   * Initializes poison objects.
   * @returns {Array} An array of initialized poison objects.
   */
  static initializePoisons() {
    const poisons = [
      new PoisonObject(800, 400, 50, 50),
      new PoisonObject(1600, 300, 50, 50),
      new PoisonObject(2400, 200, 50, 50),
      new PoisonObject(3200, 400, 50, 50),
      new PoisonObject(4000, 300, 50, 50),
      new PoisonObject(6400, 200, 50, 50),
    ];

    return poisons;
  }

  /**
   * Deactivates the poison object.
   */
  deactivate() {
    this.isActive = false;
    this.x = -1000;
  }

  /**
   * Draws the poison objects on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} camera_x - The x position of the camera.
   */
  drawPoisons(ctx, camera_x) {
    if (this.isActive && this.img) {
      ctx.drawImage(
        this.img,
        this.x + camera_x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  /**
   * Animates the poison object.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_POISON);
    }, 100);
  }
}
