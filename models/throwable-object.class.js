class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super();
    this.isVisible = true;
    this.addToImageCache('poison', LOADED_IMAGES.game_items.poison);
    this.img = this.imageCache['poison_0'];
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 50;
    this.collided = false;
    this.throw(x, y);
  }

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

  isColliding(obj) {
    return !this.collided && super.isColliding(obj);
  }

  onCollision() {
    if (this.hasHit) return;
    this.hasHit = true;
    this.speedX = 0;
    this.speedY = 0;
    this.applyGravity();
  }

  update() {
    super.update();
    if (this.y > 480) {
      this.isVisible = false;
    }
  }

  deactivate() {
    this.isVisible = false;
    this.collided = true;
  }
}