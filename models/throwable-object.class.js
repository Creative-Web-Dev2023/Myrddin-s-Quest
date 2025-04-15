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
    this.speedY = 15;
    this.acceleration = 2.0;
    this.applyGravity();
    let throwDirection = this.otherDirection ? -13 : 13;
    this.throwInterval = setInterval(() => {
      if (this.isVisible) {
        this.x += throwDirection;
        throwDirection *= 0.98;
      } else {
        clearInterval(this.throwInterval);
      }
    }, 20);
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
      ctx.save();
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      ctx.translate(centerX, centerY);
      const rotation = this.x * 0.02;
      ctx.rotate(rotation);
      ctx.drawImage(
        this.img,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.restore();
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
