class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage("img/poison/1.png");
    this.x = x; // Position des Objekts
    this.y = y; // Position des Objekts
    this.height = 90;
    this.width = 40;
    this.speedY = 30; // Erhöhte Geschwindigkeit, um den Bogen zu vergrößern
    this.speedX = 15; // Erhöhte Geschwindigkeit, um den Bogen zu vergrößern
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
