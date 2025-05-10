/**
 * Class representing the health display for a Knight.
 * @extends DrawableObject
 */
class KnightHealthDisplay extends DrawableObject {
  /**
   * Creates an instance of KnightHealthDisplay.
   * @param {Knight} knight - The knight object.
   */
  constructor(knight) {
    super();
    this.loadImage(LOADED_IMAGES.game_items.hearts[0]);
    this.addToImageCache("hearts", LOADED_IMAGES.game_items.hearts);
    this.knight = knight;
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
   * Updates the number of hits taken by the knight.
   * @param {number} hits - The number of hits the knight has taken.
   */
  updateHits(hits) {
    this.energy = 100 - hits * (100 / this.knight.maxHits); 
  }

  /**
   * Draws the health display on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    this.update();
    let heartDistance = 40;
    for (let i = 0; i < 3; i++) {
      let key = (this.energy || 0) > i * 10 ? "hearts_1" : "hearts_0";
      let img = this.imageCache[key];
      ctx.drawImage(img, this.x + i * heartDistance, this.y, 30, 30);
    }
  }

  /**
   * Updates the position of the health display.
   * @param {number} knightX - The x position of the knight.
   * @param {number} knightY - The y position of the knight.
   * @param {number} knightWidth - The width of the knight.
   */
  updatePosition(knightX, knightY, knightWidth) {
    this.x = knightX + (knightWidth / 2) - (this.width / 2);
    this.y = knightY - 40;
  }
}
