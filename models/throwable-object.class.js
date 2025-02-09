/**
 * Class representing a throwable object.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Creates an instance of ThrowableObject.
   * @param {number} x - The x position of the throwable object.
   * @param {number} y - The y position of the throwable object.
   */
  constructor(x, y) {
    super();
    this.isVisible = true;
    this.loadImage("img/poison/1.png");
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 50;
    this.collided = false;
    this.throw(x, y);
  }

  /**
   * Throws the object.
   */
  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 20;
    this.acceleration = 1.5;
    this.applyGravity();
    setInterval(() => {
      if (this.isVisible) {
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {Object} obj - The object to check collision with.
   * @returns {boolean} - True if colliding, false otherwise.
   */
  isColliding(obj) {
    return !this.collided && super.isColliding(obj);
  }

  /**
   * Draws the throwable object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.isVisible) {
      super.draw(ctx);
    }
  }

  /**
   * Handles the collision of the object.
   */
  onCollision() {
    if (this.hasHit) return;
    this.hasHit = true;
    this.speedX = 0;
    this.speedY = 0;
    this.applyGravity();
  }

  /**
   * Updates the state of the object.
   */
  update() {
    super.update();
    if (this.y > 480) {
      this.isVisible = false;
    }
  }

  /**
   * Deactivates the object.
   */
  deactivate() {
    this.isVisible = false;
    this.collided = true;
  }
}
