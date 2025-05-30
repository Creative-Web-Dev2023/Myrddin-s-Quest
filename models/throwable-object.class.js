class ThrowableObject extends MovableObject {
  offset = { top: 0, bottom: 0, left: 10, right: 10 };
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

  throw() {
    this.speedY = -20;
    this.acceleration = 1.5;

    this.applyBottleGravity();

    this.throwInterval = setInterval(() => {
      this.x += 5;
    }, 1000 / 60);
  }

  registerHit() {
    this.hasHit = true;
  }

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