/**
 * Represents a background object in the game environment.
 * @extends MovableObject
 */
class Background extends MovableObject {
  img;
  x;
  width;
  height;

  /**
   * Creates a new Background instance.
   */
  constructor(imageObject, x) {
    super();
    this.img = imageObject;
    this.x = x;
    this.width = 960;
    this.height = 540;
  }
}
