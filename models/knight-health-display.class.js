/**
 * Class representing the health display for a Knight.
 * @extends DrawableObject
 */
class KnightHealthDisplay extends DrawableObject {
  IMAGES_HEARTS = ["img/game_ui/heart_empty.png", "img/game_ui/heart_full.png"];

  /**
   * Creates an instance of KnightHealthDisplay.
   * @param {Knight} knight - The knight object.
   */
  constructor(knight) {
    super();
    this.knight = knight;
    this.loadImages(this.IMAGES_HEARTS);
    this.x = 0;
    this.y = 0;
    this.width = 120;
    this.height = 30;
    this.energy = knight.energy;
  }

  /**
   * Updates the energy of the health display.
   */
  update() {
    if (this.knight) {
      this.energy = this.knight.energy;
    }
  }

  /**
   * Draws the health display on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    this.update();
    let heartDistance = 40;
    for (let i = 0; i < 3; i++) {
      let img =
        this.energy > i * 10
          ? this.imageCache[this.IMAGES_HEARTS[1]]
          : this.imageCache[this.IMAGES_HEARTS[0]];
      ctx.drawImage(img, this.x + i * heartDistance, this.y, 30, 30);
    }
  }

  /**
   * Updates the position of the health display.
   * @param {number} knightX - The x position of the knight.
   * @param {number} knightY - The y position of the knight.
   */
  updatePosition(knightX, knightY) {
    this.x = knightX + 145;
    this.y = knightY + 30;
  }
}
