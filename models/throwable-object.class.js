class ThrowableObject extends MovableObject {
  constructor(x, y, targetX) {
    super().loadImage('img/poison/1.png');
    this.x = x;
    this.y = y;
    this.targetX = targetX; // Zielposition der Schlange
    this.width = 45; // Setze die Breite der Giftflasche
    this.height = 45; // Setze die Höhe der Giftflasche
    this.throw();
  }

  throw() {
    const distance = this.targetX - this.x;
    const throwDuration = 1000; // Dauer des Wurfs in Millisekunden
    const throwInterval = 25; // Intervall für die Wurfbewegung
    const steps = throwDuration / throwInterval;
    const stepX = distance / steps;
    this.speedY = 15; // Reduzierte Anfangsgeschwindigkeit nach oben

    this.applyGravity();
    this.throwInterval = setInterval(() => {
      this.x += stepX; // Bewegung in Richtung Ziel
      if (this.y > 500 || this.x >= this.targetX) { // Wenn die Flasche den Boden erreicht oder das Ziel erreicht
        clearInterval(this.throwInterval);
      }
    }, throwInterval);
  }

  applyGravity() {
    setInterval(() => {
      if (this.y < 500) { // Solange die Flasche nicht den Boden erreicht hat
        this.y -= this.speedY;
        this.speedY -= 0.5; // Reduzierte Schwerkraft
      }
    }, 25);
  }
}
