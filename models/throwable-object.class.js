class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super();
    this.x = 30;
    this.y = 30;
    this.speedY = 30;
    this.speedX = 20;
    this.loadImage('img/poison/1.png'); // Ensure this path is correct
    this.throw();
  }

  throw() {
    this.applyGravity();
    setInterval(() => {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.speedY -= 1; // Gravity effect
    }, 25);
  }
}
