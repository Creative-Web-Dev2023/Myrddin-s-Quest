class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage('img/throwable/bottle.png');
    this.x = x;
    this.y = y;
    this.throw();
  }

  throw() {
    this.speedY = 30; // Anfangsgeschwindigkeit nach oben
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      this.x += 10; // Bewegung nach rechts
      if (this.y > 500) { // Wenn die Flasche den Boden erreicht
        clearInterval(this.throwInterval);
      }
    }, 25);
  }

  applyGravity() {
    setInterval(() => {
      if (this.y < 500) { // Solange die Flasche nicht den Boden erreicht hat
        this.y -= this.speedY;
        this.speedY -= 1; // Schwerkraft
      }
    }, 25);
  }
}
