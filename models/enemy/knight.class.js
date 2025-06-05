/**
 * Represents a Knight enemy in the game.
 * @extends MovableObject
 */
class Knight extends MovableObject {
  offset = { top: 100, bottom: 70, left: 240, right: 100 };

  /**
   * Creates a new Knight instance.
   */
  constructor(x) {
    super();
    this.addToImageCache("walk", LOADED_IMAGES.knight.walk);
    this.img = this.imageCache["walk_0"];
    this.x = x;
    this.y = 250;
    this.speed = 1 + Math.random() * 0.5;
    this.width = 520;
    this.height = 290;
  }

  /**
   * Updates the knight's state and movement.
   */
  update() {
    this.handleAnimations();
    this.moveLeft();
  }

  /**
   * Handles the knight's animation.
   */
  handleAnimations() {
    this.animate(LOADED_IMAGES.knight.walk);
  }
}
