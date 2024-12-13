class Door extends DrawableObject {
  IMAGE_DOOR = [
    'img/door/door 0.png',
    'img/door/door 1.png',
    'img/door/door 2.png',
    'img/door/door 3.png', // Pfad zu door 3.png
    'img/door/door 4.png',
  ];

  constructor(x, y) {
    super();
    this.imageCache = {};
    this.loadImages(this.IMAGE_DOOR);
    this.x = x;
    this.y = y;
    this.width = 300; // Breite der Tür
    this.height = 460; // Höhe der Tür
    this.img = this.imageCache[this.IMAGE_DOOR[0]];
    this.animate(); // Startet die Animation
  }

  loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img; // Speichert Bilder im Cache
    });
  }

  animate() {
    let currentImageIndex = 0;
    setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[currentImageIndex]];
      currentImageIndex = (currentImageIndex + 1) % this.IMAGE_DOOR.length;
    }, 1000 / 6); // Animation: 6 Frames pro Sekunde
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Ursprung in die Mitte verschieben
    ctx.transform(1, 0.3, 0.11, 1.1, 0, 0); // Transformation
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    ); // Zeichnet die animierte Tür
    ctx.restore();
    this.drawCollisionBox(ctx); // Zeichnet die Kollisionsbox
  }

  drawCollisionBox(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";
    ctx.rect(this.x, this.y, this.width, this.height); // Kollisionsbox zeichnen
    ctx.stroke();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Prüft, ob der Charakter die Tür betritt
   */
  static checkCharacterNearDoor(world) {
    if (world.door && world.door.isCollidingWithDoor(world.character)) {
      world.door.enterDoor(world.character); // Charakter betritt die Tür
    }
  }

  /**
   * Prüft, ob der Charakter mit der Tür kollidiert
   */
  isCollidingWithDoor(character) {
    const doorHitbox = this.getHitbox();
    const characterHitbox = character.getHitbox();
  
    const isColliding =
      characterHitbox.x < doorHitbox.x + doorHitbox.width &&
      characterHitbox.x + characterHitbox.width > doorHitbox.x &&
      characterHitbox.y < doorHitbox.y + doorHitbox.height &&
      characterHitbox.y + characterHitbox.height > doorHitbox.y;
  
    console.log("Collision detected:", isColliding);
    return isColliding;
  }
  

  /**
   * Logik: Charakter tritt in die Tür ein
   */
  enterDoor(character) {
    console.log("Character entered the door!");

    // Charakter kurz unsichtbar machen
    character.isVisible = false;

    // Zeitverzögerung: Charakter erscheint auf der anderen Seite
    setTimeout(() => {
      character.x = this.x + this.width + 50; // Position auf der anderen Seite der Tür
      character.isVisible = true; // Charakter wieder sichtbar machen
    }, 1000); // Warte 1 Sekunde
  }

  /**
   * Zeichnet die Tür im Spiel
   */
  static drawDoor(world) {
    if (world.door) {
      world.door.draw(world.ctx); // Zeichnet die Tür
      world.door.drawCollisionBox(world.ctx); // Optional: Kollisionsbox anzeigen
    }
  }
}
