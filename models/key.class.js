class Key extends DrawableObject {
  IMAGE_KEY = ["img/game_items/key.png"];
  
  isActive = true;

  constructor(x, y) {
    super();
    this.imageCache = {};
    this.loadImages(this.IMAGE_KEY);
    this.x = x;
    this.y = y + 50; // Setzen Sie die y-Position weiter nach unten
    this.width = 50;
    this.height = 50;
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.imageCache[this.IMAGE_KEY], this.x, this.y, this.width, this.height);
    }
  }

  drawCollisionBox(ctx) {
    if (this.isActive) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height); // Zeichnet die Kollisionsbox des Schlüssels
      ctx.stroke();
    }
  }

  deactivate() {
    this.isActive = false; // Mache den Schlüssel inaktiv, nachdem er eingesammelt wurde
  }
}
