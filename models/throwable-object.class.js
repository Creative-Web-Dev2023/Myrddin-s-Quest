/**
 * Represents a throwable poison bottle object in the game.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * The hitbox offset for the throwable object.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 0, bottom: 0, left: 10, right: 10 };

  /**
   * Indicates if the bottle has already hit something.
   * @type {boolean}
   */
  hasHit;

  /**
   * The interval ID for the throw movement.
   * @type {number}
   */
  throwInterval;

  /**
   * The interval ID for the gravity effect.
   * @type {number}
   */
  gravityInterval;

  /**
   * Creates a new ThrowableObject instance.
   * @param {number} x - The X position where the bottle is thrown.
   * @param {number} y - The Y position where the bottle is thrown.
   */
  constructor(x, y) {
    super();
    this.img = LOADED_IMAGES.game_items.poison[0];
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 70;
    this.hasHit = false;
    this.throw();
  }

  /**
   * Starts the throw movement and applies gravity.
   */
  throw() {
    this.speedY = -20;
    this.acceleration = 1.5;
    this.applyBottleGravity();
    this.throwInterval = setInterval(() => {
      this.x += 5;
    }, 1000 / 60);
  }

  /**
   * Registers a hit for the bottle (prevents further collision).
   */
  registerHit() {
    this.hasHit = true;
  }

  /**
   * Applies gravity to the bottle and removes it when it falls out of bounds.
   */
  applyBottleGravity() {
    this.gravityInterval = setInterval(() => {
      this.y += this.speedY;
      this.speedY += this.acceleration;
      if (this.y > 720) {
        clearInterval(this.gravityInterval);
        clearInterval(this.throwInterval);
        this.markedForRemoval = true;
      }
    }, 1000 / 25);
  }
}
