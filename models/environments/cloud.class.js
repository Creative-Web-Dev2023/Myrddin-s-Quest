/**
 * Class representing a single cloud.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    height = 200;
    width = 300;
    speed = 0.2;
  
    /**
     * Creates an instance of Cloud.
     * @param {number} initialX - The initial x position of the cloud.
     */
    constructor() {
      super();
      this.loadImage(LOADED_IMAGES.natural_objects.cloud);
      this.x = Math.random() * 2600;
      this.y = Math.random() * 50;
    }
  
    /**
     * Updates the cloud's position. If it leaves the screen, it wraps around.
     */
    updatePosition() {
      this.x -= this.speed;
      if (this.x + this.width < 0) {
        this.x = 2600 + Math.random() * 500;
        this.y = Math.random() * 50;
      }
    }
  }
  