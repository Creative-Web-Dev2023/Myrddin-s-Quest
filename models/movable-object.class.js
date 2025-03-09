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

  /**
   * 🔹 Wendet die Gravitation auf das Objekt an
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

  // 🔹 Bewegung
  moveRight() {
    this.x += this.speed;
    this.playWalkingSound();
  }

  moveLeft() {
    this.x -= this.speed;
    this.playWalkingSound();
  }

  jump() {
    if (this.isAboveGround()) return;
    this.speedY = 30;
    playJumpSound();
  }

  playWalkingSound() {
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
  }

  // 🔹 Kollisionen & Zustand
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < 150;
  }

  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false;
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }

  isHurt() {
    return (new Date().getTime() - this.lastHit) / 1000 < 5;
  }

  isDead() {
    return this.energy <= 0;
  }

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

  die() {
    if (this.deadAnimationPlayed) return;

    this.deadAnimationPlayed = true;
    this.playDeathAnimation();
  }

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

  stopAllAnimations() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }

  playAnimation(images) {
    if (!images || !Array.isArray(images) || images.length === 0) return;
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
    this.lastFrame = Date.now();
  }

  playDeathAnimation() {
    this.stopAllAnimations();
    let deathIndex = 0;
    let deathInterval = setInterval(() => {
      if (deathIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        this.isVisible = false;
      }
    }, 150);
    this.animationIntervals.push(deathInterval);
  }
}
