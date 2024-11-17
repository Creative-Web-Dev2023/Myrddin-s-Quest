class Coin extends DrawableObject {
  IMAGES_COIN = [
    "img/game_items/coin1.png",
    "img/game_items/coin2.png",
    "img/game_items/coin3.png",
    "img/game_items/coin4.png",
    "img/game_items/coin5.png",
    "img/game_items/coin6.png",
    "img/game_items/coin7.png",
    "img/game_items/coin8.png",
    "img/game_items/coin9.png",
    "img/game_items/coin10.png",
  ];

  isActive = true;

  constructor(x, y) {
    super(); // Konstruktor der Elternklasse aufrufen (DrawableObject)
    this.imageCache = {};
    this.loadImages(this.IMAGES_COIN); // Bilder laden
    this.x = x; // Position der Münze
    this.y = y;
    this.width = 60; // Breite des Münzbilder
    this.height = 60; // Höhe des Münzbilder
    this.currentImageIndex = 0;
    this.img = new Image();
    this.img.src = this.IMAGES_COIN[this.currentImageIndex]; 
    this.img.onload = () => {
      this.animate(); // Beginne erst mit der Animation, wenn das Bild geladen ist
    };
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
        clearInterval(this.animationInterval); // Stoppe die Animation, wenn die Münze inaktiv wird
        return;
      }
      this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_COIN.length;
      this.img = this.imageCache[this.IMAGES_COIN[this.currentImageIndex]]; // Aktualisiere das Bild
    }, 100); // Geschwindigkeit der Animation (100ms pro Frame)
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  deactivate() {
    this.isActive = false; // Mache die Münze inaktiv, nachdem sie gesammelt wurde
  }

  drawCollisionBox(ctx) {
    if (this.isActive) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height); // Zeichnet die Kollisionsbox der Münze
      ctx.stroke();
    }
  }

  getHitbox() {
    const hitbox = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
    console.log('Coin hitbox:', hitbox); // Debugging-Ausgabe
    return hitbox;
  }
}