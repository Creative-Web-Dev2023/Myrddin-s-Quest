class ThrowableObject extends MovableObject {
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

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 20;
    this.acceleration = 1.5;
    this.applyGravity();
    setInterval(() => {
      if (this.isVisible) { 
        this.x += 10;
      }
    }, 25);
  }

  isColliding(obj) {
    return !this.collided && super.isColliding(obj);
}
  draw(ctx) {
    if (this.isVisible) { 
      super.draw(ctx);
    }
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
}