class PoisonObject extends MovableObject {
  IMAGES_POISON = [
    "img/poison/1.png",
    "img/poison/2.png",
    "img/poison/3.png",
    "img/poison/4.png",
    "img/poison/5.png",
    "img/poison/6.png",
    "img/poison/7.png",
    "img/poison/8.png",
  ];

  constructor(x, y) {
    super(); // Konstruktor der Elternklasse aufrufen (MovableObject)
    this.imageCache = {};
    this.loadImages(this.IMAGES_POISON); // Bilder laden
    this.x = x; // Position des Giftobjekts
    this.y = y;
    this.width = 60; // Breite des Giftobjekts
    this.height = 60; // Höhe des Giftobjekts
    this.currentImageIndex = 0;
    this.img = new Image();
    this.img.src = this.IMAGES_POISON[this.currentImageIndex]; 
    this.img.onload = () => {
      this.animate(); // Beginne erst mit der Animation, wenn das Bild geladen ist
    };
    this.isActive = true;
  }

  loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img; // Speichern im Cache
    });
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (!this.isActive) { 
        clearInterval(this.animationInterval); // Stoppe die Animation, wenn das Giftobjekt inaktiv wird
        return;
      }
      this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_POISON.length;
      this.img = this.imageCache[this.IMAGES_POISON[this.currentImageIndex]]; // Aktualisiere das Bild
    }, 100); // Geschwindigkeit der Animation (100ms pro Frame)
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  deactivate() {
    this.isActive = false; // Mache das Giftobjekt inaktiv, nachdem es gesammelt wurde
    this.x = -1000; // Bewege das Objekt aus dem sichtbaren Bereich
    this.y = -1000; // Optional: Auch die Y-Koordinate anpassen
  }

  drawCollisionBox(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    ctx.rect(this.x, this.y, this.width, this.height); // Zeichnet die Kollisionsbox des Giftobjekts
    ctx.stroke();
  }

  checkCollision(character) {
    const poisonHitbox = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };

    const characterHitbox = {
      x: character.x + character.offset.left,
      y: character.y + character.offset.top,
      width: character.width - character.offset.left - character.offset.right,
      height: character.height - character.offset.top - character.offset.bottom
    };

    return (
      poisonHitbox.x < characterHitbox.x + characterHitbox.width &&
      poisonHitbox.x + poisonHitbox.width > characterHitbox.x &&
      poisonHitbox.y < characterHitbox.y + characterHitbox.height &&
      poisonHitbox.y + poisonHitbox.height > characterHitbox.y
    );
  }
}