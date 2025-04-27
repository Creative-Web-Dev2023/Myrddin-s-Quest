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
      this.addToImageCache('endboss', LOADED_IMAGES.gameUI.status_bars.endboss);
      this.y = 710;
      this.width = 170;
      this.height = 40;
      this.setPercentage(100);
    }
  
    /**
     * Sets the percentage of the endboss status bar.
     * @param {number} percentage - The percentage to set.
     */
    setPercentage(percentage) {
      this.percentage = percentage;
      this.img =
        LOADED_IMAGES.gameUI.status_bars.endboss[this.resolveImageIndex()];
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