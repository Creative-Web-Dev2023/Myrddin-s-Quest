/**
 * Base class for all movable objects in the game.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  invulnerable = false;
  isDeadAlready = false;
  lastHit = 0;
  otherDirection = false;
  imageCache = {};
  currentImage = 0;
  lastAnimationTime = 0;
  animationSpeed = 100;
  floatAmplitude = 20;
  floatSpeed = 2;
  floatOffset = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Creates a new MovableObject.
   */
  constructor() {
    super();
  }

  /**
   * Adds images to the image cache.
   */
  addToImageCache(prefix, imagesArray) {
    if (!Array.isArray(imagesArray)) return;
    imagesArray.forEach((img, index) => {
      if (img instanceof HTMLImageElement) {
        this.imageCache[`${prefix}_${index}`] = img;
      } else {
        console.warn(
          `Unloaded image in array ${prefix} at index ${index}:`,
          img
        );
      }
    });
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
   * Applies gravity to the object.
   */
  applyGravity() {
    this.stopGravity();
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Stops gravity for the object.
   */
  stopGravity() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
  }

  /**
   * Checks if the object is above ground
   */
  isAboveGround() {
    return this.y < 270;
  }

  /**
   * Gets the hitbox of the object.
   */
  getHitbox(offset = this.offset) {
    return {
      x: this.x + (offset?.left || 0),
      y: this.y + (offset?.top || 0),
      width: this.width - (offset?.left || 0) - (offset?.right || 0),
      height: this.height - (offset?.top || 0) - (offset?.bottom || 0),
    };
  }

  /**
   * Checks if this object is above another object.
   */
  isAbove(other, tolerance = 10) {
    const myBox = this.getHitbox();
    const otherBox = other.getHitbox();
    const isFalling = this.speedY < 0;
    return isFalling && myBox.y + myBox.height <= otherBox.y + tolerance;
  }

  /**
   * Checks if this object is colliding with another object.
   */
  isColliding(other) {
    if (!(other instanceof DrawableObject)) return false;
    const a = this.getHitbox();
    const b = other.getHitbox();
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }

  /**
   * Checks if two rectangles overlap.
   */
  rectanglesOverlap(a, b) {
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }

  /**
   * Applies damage to the object.
   */
  takeDamage(amount, sound, imageSet) {
    if (this.invulnerable || this.isDead()) return;
    this.energy = Math.max(this.energy - amount, 0);
    if (this.healthBar) {
      this.healthBar.setPercentage(this.energy);
    }
    this.invulnerable = true;
    this.playSound(sound);
    this.playAnimationOnce(imageSet);
    setTimeout(() => {
      this.invulnerable = false;
    }, 800);
  }

  /**
   * Checks if the object is dead.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Checks if the object is hurt.
   */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 5;
  }

  /**
   * Plays the death animation and sound.
   */
  playDeathAnimation(imageSet, sound = null, afterAnimation) {
    if (!this.isDead() || this.isDeadAlready) return;
    this.isDeadAlready = true;
    this.playSound(sound);
    this.playAnimationOnce(imageSet, afterAnimation);
  }

  /**
   * Plays an animation sequence once.
   */
  playAnimationOnce(imageSet, afterAnimation = null) {
    let frame = 0;
    const interval = setInterval(() => {
      if (frame >= imageSet.length) {
        clearInterval(interval);
        if (typeof afterAnimation === "function") {
          afterAnimation();
        }
        return;
      }
      const img = imageSet[frame++];
      if (img instanceof HTMLImageElement) {
        this.img = img;
      }
    }, this.animationSpeed || 100);
  }

  /**
   * Animates the object using a set of images.
   */
  animate(images) {
    const now = performance.now();
    if (now - this.lastAnimationTime < this.animationSpeed) return;
    this.lastAnimationTime = now;
    this.currentImage = (this.currentImage + 1) % images.length;
    const img = images[this.currentImage];
    if (img instanceof HTMLImageElement) {
      this.img = img;
    } else {
      console.warn("[animate()] Kein gültiges Bild:", img);
    }
  }

  /**
   * Handles floating animation for the object.
   */
  handleFloating() {
    this.floatOffset += 0.05;
    this.y =
      this.startY +
      Math.sin(this.floatOffset * this.floatSpeed) * this.floatAmplitude;
  }

  /**
   * Plays a sound if noises are enabled.
   * Prevents AbortError by only playing if not already playing.
   * @param {HTMLAudioElement} sound - The sound to play.
   */
  playSound(sound) {
    if (window.flags.noises && sound) {
      // Only play if not already playing
      if (sound.paused || sound.ended) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    }
  }

  /**
   * Pauses a sound.
   */
  soundPause(sound) {
    sound.pause();
  }
}
