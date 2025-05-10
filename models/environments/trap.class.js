/**
 * Class representing a trap.
 * @extends MovableObject
 */
class Trap extends MovableObject {
  height = 180;
  width = 180;
  isActive = false;
  isRemoved = false;
  animationIntervals = [];

  /**
   * Creates an instance of Trap.
   * @param {number} x - The x position of the trap.
   * @param {number} y - The y position of the trap.
   */
  constructor(x, y) {
    super();
    this.loadImage(LOADED_IMAGES.game_items.trap[0]);
    this.addToImageCache('trap', LOADED_IMAGES.game_items.trap);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Animates the trap.
   */
  animate() {
    const interval = setInterval(() => {
      if (!this.isRemoved) {
        this.playAnimation(LOADED_IMAGES.game_items.trap);
      }
    }, 100);
    this.animationIntervals.push(interval);
  }

  /**
   * Removes the trap from the world.
   */
  remove() {
    this.isRemoved = true;
    this.isActive = false;
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }
  
}