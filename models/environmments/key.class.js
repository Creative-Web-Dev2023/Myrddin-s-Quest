/**
 * Class representing a key object.
 * @extends DrawableObject
 */
class Key extends DrawableObject {
  /**
   * Creates an instance of Key.
   * @param {number} x - The x position of the key.
   * @param {number} y - The y position of the key.
   * @param {string} id - The id of the key.
   */
  constructor(x, y, id) {
    super().loadImage("img/game_items/key.png");
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.isActive = true;
  }

  /**
   * Draws the key object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Deactivates the key object.
   */
  deactivate() {
    this.isActive = false;
  }

  /**
   * Initializes a key object.
   * @returns {Key[]} An array containing a new key object.
   */
  static initializeKey() {
    return [new Key(300, 400)];
  }
}
