/**
 * Class representing a Poison object.
 * @extends DrawableObject
 */
class PoisonObject extends DrawableObject {
  isActive = true;

  /**
   * Creates an instance of PoisonObject.
   * @param {number} x - The x position of the poison object.
   * @param {number} y - The y position of the poison object.
   * @param {number} width - The width of the poison object.
   * @param {number} height - The height of the poison object.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.isActive = true;
    console.log(`[PoisonObject] Initialized at x=${this.x}, y=${this.y}`); // Debug-Log
  }

  /**
   * Deactivates the poison object.
   */
  deactivate() {
    this.isActive = false;
    this.x = -1000;
  }

  draw(ctx) {
    if (this.isActive && this.img) {
      console.log(`[PoisonObject] Zeichne Poison bei x=${this.x}, y=${this.y}`); // Debug-Log
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}