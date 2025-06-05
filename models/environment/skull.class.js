/**
 * Represents a skull object in the game environment.
 * @extends DrawableObject
 */
class Skull extends DrawableObject {
  /**
   * Creates a new Skull instance.
   */
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.skull;
    this.x = x;
    this.y = 280;
    this.width = 250;
    this.height = 250;
  }
}
