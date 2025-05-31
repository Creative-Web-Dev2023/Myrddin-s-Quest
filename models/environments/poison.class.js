/**
 * Represents a poison collectible object in the game.
 * @extends MovableObject
 */
class PoisonObject extends MovableObject {
  /**
   * The hitbox offset for the poison object.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 0, bottom: 0, left: 10, right: 10 };

  /**
   * Creates a new PoisonObject instance.
   * @param {number} x - The X position of the poison object.
   */
  constructor(x) {
    super();
    this.addToImageCache("poison", LOADED_IMAGES.game_items.poison);
    this.img = this.imageCache["poison_0"];
    this.x = x;
    this.y = Math.floor(Math.random() * 220);
    this.startY = this.y;
    this.width = 70;
    this.height = 70;
  }

  /**
   * Updates the poison object's animation and floating effect.
   */
  update() {
    this.handleAnimations();
    this.handleFloating();
  }

  /**
   * Handles the poison object's animation.
   */
  handleAnimations() {
    this.animate(LOADED_IMAGES.game_items.poison);
  }
}
