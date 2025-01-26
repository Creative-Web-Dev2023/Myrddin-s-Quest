class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage("img/poison/1.png");
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 50;
    this.isVisible = true; // Neue Eigenschaft hinzufügen
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 20;
    this.acceleration = 1.5;
    this.applyGravity();
    setInterval(() => {
      if (this.isVisible) { // Überprüfe, ob die Flasche sichtbar ist
        this.x += 10;
      }
    }, 25);
  }

  draw(ctx) {
    if (this.isVisible) { 
      super.draw(ctx);
    }
  }
}
