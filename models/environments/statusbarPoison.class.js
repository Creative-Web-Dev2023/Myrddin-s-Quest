/**
 * Class representing a poison status bar.
 * @extends DrawableObject
 */
class PoisonStatusBar extends DrawableObject {
  /**
   * Creates an instance of PoisonStatusBar.
   */
  constructor() {
    super();
    this.loadImage(LOADED_IMAGES.gameUI.status_bars.poison[0]);
    this.addToImageCache('poison', LOADED_IMAGES.gameUI.status_bars.poison);
    this.x = 2;
    this.y = 50;
    this.width = 190;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage of the poison status bar.
   * @param {number} percentage - The percentage to set.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = LOADED_IMAGES.gameUI.status_bars.poison[this.calculateImageIndex()];
  }

  /**
   * Calculates the image index based on the percentage.
   * @returns {number} The image index.
   */
  calculateImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  /**
   * Increases the percentage of the poison status bar.
   * @param {number} amount - The amount to increase.
   */
  increasePercentage(amount) {
    this.percentage = Math.min(100, this.percentage + amount);
    this.setPercentage(this.percentage);
  }
}