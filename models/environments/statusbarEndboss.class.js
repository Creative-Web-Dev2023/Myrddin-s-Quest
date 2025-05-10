/**
 * Class representing the endboss status bar.
 * @extends DrawableObject
 */
class EndbossStatusbar extends DrawableObject {
  percentage = 100;

  /**
   * Creates an instance of EndbossStatusbar.
   */
  constructor() {
    super();
    this.loadImage(LOADED_IMAGES.gameUI.status_bars.endboss[0]);
    this.addToImageCache("endboss", LOADED_IMAGES.gameUI.status_bars.endboss);
    this.y = 710;
    this.width = 170;
    this.height = 40;
    this.setPercentage(100); // Initialize with full health
  }

  /**
   * Sets the percentage of the endboss status bar.
   * @param {number} percentage - The percentage to set.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage)); 
    const imageIndex = this.resolveImageIndex();
    this.img = this.imageCache[`endboss_${imageIndex}`]; 
  }

  takeDamage(damage) {
    if (this.dead) return;
    super.takeDamage(damage);
    this.statusBarEndboss.setPercentage(this.energy);
  }

  /**
   * Updates the position of the status bar based on the Endboss's position.
   * @param {number} endbossX - The x position of the Endboss.
   * @param {number} endbossY - The y position of the Endboss.
   */
  updatePosition(endbossX, endbossY) {
    this.x = endbossX + 90; 
    this.y = endbossY - 50; 
  }

  /**
   * Resolves the image index based on the percentage.
   * @returns {number} The image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
