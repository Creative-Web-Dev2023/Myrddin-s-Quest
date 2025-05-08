/**
 * Class representing a movable object.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  isVisible = true;
  animationIntervals = [];
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  constructor() {
    super();
    this.deadAnimationPlayed = false;
  }

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Stops the gravity effect on the object.
   */
  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    if (this.isAboveGround()) return;
    this.speedY = 30;
    playJumpSound();
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < 150;
  }

  /**
   * Checks if the object is colliding with another movable object.
   * @param {MovableObject} mo - The other movable object.
   * @returns {boolean} True if the objects are colliding, false otherwise.
   */
  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false;
    const colliding =
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height;

    if (colliding) {
      console.log("Kollision erkannt mit:", mo.constructor.name);
    }

    return colliding;
  }

  /**
   * Gets the collision box of the object.
   * @returns {Object} The collision box of the object.
   */
  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }

  /**
   * Checks if the object is hurt.
   * @returns {boolean} True if the object is hurt, false otherwise.
   */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 5;
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean} True if the object is dead, false otherwise.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Makes the object take damage.
   * @param {number} damage - The amount of damage to take.
   */
  takeDamage(damage) {
    if (this.energy <= 0 || this.invulnerable) return;
    this.energy -= damage;
    this.lastHit = Date.now();
    this.invulnerable = true;

    if (this.energy <= 0) {
      this.die();
    } else {
      setTimeout(() => (this.invulnerable = false), 2000);
    }
  }

  /**
   * Handles the object's death.
   */
  die() {
    if (this.deadAnimationPlayed) return;
    this.deadAnimationPlayed = true;
    this.playDeathAnimation();
  }
  

  playGenericAnimation(images, speed = 100, loop = true, animationName = '', onComplete = null) {
    if (this.currentAnimationName === animationName) return;
    this.stopAllAnimations();
    this.currentAnimationName = animationName;
    let index = 0;
    const animationInterval = setInterval(() => {
      if (index < images.length) {
        this.img = images[index];
        index++;
      } else if (loop) {
        index = 0;
      } else {
        clearInterval(animationInterval);
        if (onComplete) onComplete();
      }
    }, speed);
    this.animationIntervals.push(animationInterval);
  }
  
  /**
   * Stops all animations.
   */
 stopAllAnimations() {
  this.animationIntervals.forEach(clearInterval);
  this.animationIntervals = [];
  this.currentAnimationName = null; 
}

  registerInterval(interval) {
    if (!this.allIntervals) this.allIntervals = [];
    this.allIntervals.push(interval);
  }

  clearAllIntervals() {
    this.allIntervals.forEach(clearInterval);
  }
  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    location.reload(); 
  }

  drawWithCollisionBox(ctx) {
    super.draw(ctx);
    const box = this.getCollisionBox();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
  }

  setCustomInterval(fn, interval) {
    const id = setInterval(fn, interval);
    this.animationIntervals.push(id);
    return id;
  }
}
