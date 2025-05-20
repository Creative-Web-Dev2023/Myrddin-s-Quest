class MovableObject extends DrawableObject {
  speed = 0;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  isVisible = true;
  otherDirection = false;
  imageCache = {};
  currentImage = 0;
  lastAnimationTime = 0;
  animationSpeed = 100;
  currentAnimation = null;
  animationIntervals = [];
  floatAmplitude = 20;
  floatSpeed = 2;
  floatOffset = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  constructor() {
    super();
  }

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

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  applyGravity() {
    this.stopGravity();
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } 
    }, 1000 / 25);
  }

  stopGravity() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
  }

  isAboveGround() {
    return this.y < 270;
  }

  isColliding(mo) {
    if (!(mo instanceof DrawableObject)) return false;
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }

  takeDamage(damage) {
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
    }
  }

  isDead() {
    return this.energy <= 0;
  }

  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 5;
  }

  die() {
    this.deadAnimationPlayed = true;
    this.playDeathAnimation();
  }

  playDeathAnimation() {
    const images = LOADED_IMAGES.character.die;
    let index = 0;
    /*     this.stopAllAnimations();
    const interval = setInterval(() => {
      if (index < images.length) {
        this.img = this.imageCache[images[index]];
        index++;
      } else {
        clearInterval(interval);
        this.isVisible = false;
      }
    }, 150);
    this.animationIntervals.push(interval); */
  }

  animate(images) {
    const now = performance.now();
    if (now - this.lastAnimationTime < this.animationSpeed) return;

    this.lastAnimationTime = now;
    this.currentImage = (this.currentImage + 1) % images.length;
    const img = images[this.currentImage];

    if (img instanceof HTMLImageElement) {
      this.img = img;
    } else {
      console.warn('[animate()] Kein gültiges Bild:', img);
    }
  }

  handleFloating() {
    this.floatOffset += 0.05;
    this.y =
      this.startY +
      Math.sin(this.floatOffset * this.floatSpeed) * this.floatAmplitude;
  }
}