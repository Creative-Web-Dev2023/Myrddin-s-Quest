class ThrowableObject extends MovableObject {
  constructor(x, y, targetX) {
    super().loadImage("img/poison/1.png");
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.width = 45;
    this.height = 45;
    this.speedX = 10 * (targetX > x ? 1 : -1); // Geschwindigkeit in x-Richtung
    this.speedY = 15; // Anfangsgeschwindigkeit in y-Richtung
    this.gravity = 0.5; // Schwerkraft-Effekt
    this.isActive = true; // Flag, um die Aktivität der Flasche zu verfolgen
    this.throw();
  }

  throw() {
    this.applyGravity();  // Stelle sicher, dass Gravitation angewendet wird
    setInterval(() => {
      if (this.isActive) {
        this.x += this.speedX; // Bewegungsrichtung nach links oder rechts
        this.y -= this.speedY; // Bewegungsrichtung nach oben oder unten
      }
    }, 25);
  }
  

  update() {
    if (this.isActive) {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.speedY -= this.gravity; // Schwerkraft-Effekt
    }
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  deactivate() {
    this.isActive = false; // Deaktiviere die Flasche
  }

  stop() {
    this.speedX = 0;
    this.speedY = 0;
    this.isActive = false;
  }
}
