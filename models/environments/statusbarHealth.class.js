/**
 * Class representing a status bar.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    percentage = 100;
  
    /**
     * Creates an instance of StatusBar.
     */
    constructor() {
      super();
      this.loadImage(LOADED_IMAGES.gameUI.status_bars.health[0]);
      this.addToImageCache('health', LOADED_IMAGES.gameUI.status_bars.health);
      this.x = 2;
      this.y = 10;
      this.width = 190;
      this.height = 50;
      this.setPercentage(100);
    }
  
    /**
     * Sets the percentage of the status bar.
     * @param {number} percentage - The percentage to set.
     */
    setPercentage(percentage) {
      this.percentage = percentage;
      this.img = LOADED_IMAGES.gameUI.status_bars.health[this.resolveImageIndex()];
    }
  
    /**
     * Resolves the image index based on the percentage.
     * @returns {number} The image index.
     */
    resolveImageIndex() {
      if (this.percentage >= 100) {
        return 5;
      } else if (this.percentage >= 80) {
        return 4;
      } else if (this.percentage >= 60) {
        return 3;
      } else if (this.percentage >= 40) {
        return 2;
      } else if (this.percentage >= 20) {
        return 1;
      } else {
        return 0;
      }
    }
  
    /**
     * Sets the health of the status bar.
     * @param {number} health - The health to set.
     */
    setHealth(health) {
      this.healthElement.style.width = health + '%';
    }
  }