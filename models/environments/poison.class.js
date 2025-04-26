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
  constructor(x, y) {
    super();
    this.loadImages(LOADED_IMAGES.game_items.poison[0]);
    this.addToImageCache('poison', LOADED_IMAGES.game_items.poison);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.animate();
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
      this.playAnimation(LOADED_IMAGES.game_items.poison);
    }, 100);
  }
}