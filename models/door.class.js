class Door extends MovableObject {
  static doorImages = [
    "img/door/door 0.png",
    "img/door/door 1.png",
    "img/door/door 2.png",
    "img/door/door 3.png",
    "img/door/door 4.png",
  ];

  isVisible = true; // Setzen Sie die Tür auf immer sichtbar

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 300;
    this.height = 460;
    this.loadImage(Door.doorImages[0]);
    this.loadImages(Door.doorImages);
    this.animate();
  }

  show() {
    this.isVisible = true;
  }

  animate() {
    setInterval(() => {
      this.playAnimation(Door.doorImages);
    }, 300);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Ursprung in die Mitte der Tür verschieben
    ctx.transform(1, 0.3, 0.1, 1.1, 0, 0); // Keine Neigung und Skalierung
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    ); // Zentriertes Zeichnen
    ctx.restore();
  }

  drawCollisionBox(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
}



