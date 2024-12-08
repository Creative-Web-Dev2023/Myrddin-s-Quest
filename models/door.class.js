class Door extends DrawableObject {
  IMAGE_DOOR_CLOSED = "img/door/door 0.png";
  IMAGE_DOOR_OPEN = "img/door/door 4.png";

  constructor(x, y) {
    super();
    this.imageCache = {};
    this.loadImages([this.IMAGE_DOOR_CLOSED, this.IMAGE_DOOR_OPEN]);
    this.x = x;
    this.y = y;
    this.width = 300; // Passen Sie die Breite der Tür an
    this.height = 460; // Passen Sie die Höhe der Tür an
    this.img = this.imageCache[this.IMAGE_DOOR_CLOSED];
    this.isOpen = false;
  }

  loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img; // Speichern im Cache
    });
  }

  animate() {
    if (this.isOpen) {
      this.img = this.imageCache[this.IMAGE_DOOR_OPEN];
    } else {
      this.img = this.imageCache[this.IMAGE_DOOR_CLOSED];
    }
  }

  openDoor() {
    this.isOpen = true;
    this.img = this.imageCache[this.IMAGE_DOOR_OPEN];
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Ursprung in die Mitte der Tür verschieben
    ctx.transform(1, 0.3, 0.11, 1.1, 0, 0); // Keine Neigung und Skalierung
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
    ctx.strokeStyle = "red";
    ctx.rect(this.x, this.y, this.width, this.height); // Zeichnet die Kollisionsbox der Tür
    ctx.stroke();
  }
}



