/**
 * Class representing a key object.
 * @extends DrawableObject
 */
class Key extends DrawableObject {
  /**
   * Creates an instance of Key.
   * @param {string} imagePath - The path to the key image.
   * @param {number} x - The x position of the key.
   * @param {number} y - The y position of the key.
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = 65;
    this.height = 65;
    this.isActive = true;
  }

  /**
   * Deactivates the key object.
   */
  deactivate() {
    this.isActive = false;
  }

}
