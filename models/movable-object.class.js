/**
 * Class representing a movable object.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  drawRectangle = true;
  speed = 0.15;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  currentImage = 0;
  lastFrame = 0;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

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
   * Checks if the object is above the ground.
   * @returns {boolean} True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {MovableObject} mo - The other movable object.
   * @returns {boolean} True if the objects are colliding, false otherwise.
   */
  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false;
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
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
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 5;
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean} True if the object is dead, false otherwise.
   */
  isDead() {
    if (
      typeof gameState !== "undefined" &&
      typeof world !== "undefined" &&
      typeof world.character !== "undefined"
    ) {
      gameState.save();
    }
    return this.energy <= 0;
  }

  /**
   * Loads images for the object.
   * @param {string[]} images - The array of image paths to load.
   */
  loadImages(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return;
    }
    this.imageCache = this.imageCache || {};
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Takes damage and updates the object's energy.
   * @param {number} damage - The amount of damage to take.
   */
  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
      this.energy -= damage;
      this.playAnimation(this.IMAGES_HURT);
      if (this.energy <= 0) {
        this.energy = 0;
        this.die();
      } else {
        this.invulnerable = true;
        setTimeout(() => {
          this.invulnerable = false;
        }, 2000);
      }
    }
  }

  /**
   * Handles the death of the object.
   */
  die() {
    this.isVisible = false;
  }
  /**
   * Animates the object.
   */
  animate() {
    if (this.deadAnimationPlayed) return;
    this.animationInterval = setInterval(() => {
      if (typeof this.isDead === "function" && this.isDead()) {
        this.handleDeadAnimation();
      } else if (this.world && this.world.board && this.world.keyboard.ATTACK) {
        this.playAnimationWithSound(this.IMAGES_ATTACK, attackSound);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (
        this.world &&
        this.world.keyboard &&
        (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      ) {
        this.playAnimationWithSound(this.IMAGES_WALKING, walkingSound);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100);
  }

  /**
   * Plays an animation with sound for the object.
   * @param {string[]} images - The array of image paths for the animation.
   * @param {HTMLAudioElement} sound - The sound to play with the animation.
   */
  playAnimationWithSound(images, sound) {
    this.playAnimation(images);
    if (musicIsOn) {
      if (sound.paused) {
        sound.play();
      }
    } else {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Handles the dead animation for the object.
   */
  handleDeadAnimation() {
    let deathIndex = 0;
    const deathInterval = setInterval(() => {
      if (deathIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        setTimeout(() => {
          if (this.world.endGame) {
            this.world.endGame.showYouLostScreen();
          }
        }, 2000);
      }
    }, 150);
  }

  /**
   * Plays an animation for the object.
   * @param {string[]} images - The array of image paths for the animation.
   */
  playAnimation(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return;
    }
    if (this.currentImage >= images.length) {
      this.currentImage = 0;
    }
    if (
      this.currentImage % images.length === 0 ||
      Date.now() - this.lastFrame > 100
    ) {
      let i = this.currentImage % images.length;
      this.img = this.imageCache[images[i]];
      this.currentImage++;
      this.lastFrame = Date.now();
    }
  }
}
