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
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.playWalkingSound();
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.playWalkingSound();
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
   * Plays the walking sound.
   */
  playWalkingSound() {
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
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
    this.playAnimation(this.IMAGES_HURT);
    if (this.energy <= 0) {
      this.energy = 0;
      this.die();
    } else {
      this.invulnerable = true;
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

  /**
   * Animates the object.
   */
  animate() {
    this.stopAllAnimations();
    let interval = setInterval(() => {
      if (this.isDead()) {
        this.playDeathAnimation();
        clearInterval(interval);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100);

    this.animationIntervals.push(interval);
  }

  /**
   * Stops all animations.
   */
  stopAllAnimations() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }

  /**
   * Plays an animation.
   * @param {Array} images - The array of images for the animation.
   */
  playAnimation(images) {
    if (!images || !Array.isArray(images) || images.length === 0) return;
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
    this.lastFrame = Date.now();
  }

  /**
   * Plays the death animation.
   */
  playDeathAnimation() {
    this.stopAllAnimations();
    let deathImages = this.IMAGES?.DEAD || this.IMAGES_DEAD;
    if (!deathImages || deathImages.length === 0) {
      return;
    }
    let deathIndex = 0;
    let deathInterval = setInterval(() => {
      if (deathIndex < deathImages.length) {
        this.img = this.imageCache[deathImages[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        this.isVisible = false;
      }
    }, 150);
    this.animationIntervals.push(deathInterval);
  }
}
