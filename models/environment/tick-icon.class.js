/**
 * Represents the tick icon shown when the key is collected.
 */
class TickIcon extends DrawableObject {
  img;
  x;
  y;
  width;
  height;

  /**
   * Initializes a new instance of the TickIcon class.
   * Sets the image, position, and size of the tick icon.
   */
  constructor() {
    super();
    this.img = LOADED_IMAGES.gameUI.tick_icon;
    this.x = 320;
    this.y = 20;
    this.width = 50;
    this.height = 50;
  }
}
