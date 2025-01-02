class Door extends DrawableObject {
  IMAGE_DOOR = [
    'img/door/door 0.png',
    'img/door/door 1.png',
    'img/door/door 2.png',
    'img/door/door 3.png', // Pfad zu door 3.png
    'img/door/door 4.png',
  ];

  constructor(x, y, id) {
    super();
    this.id = id;
    this.imageCache = {};
    this.loadImages(this.IMAGE_DOOR);
    this.x = 4500;
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
    }, 1000 / 4); // Animation: 6 Frames pro Sekunde
  }

  draw(ctx) {
    super.draw(ctx); // Zeichne das Türbild
    this.drawFrame(ctx); // Zeichne die Kollisionsbox der Tür
  }

  static checkCharacterNearDoor(world) {
    if (!world.door) {
      return;
    }

    const character = world.character;
    const door = world.door;
    const distance = Math.abs(character.x - door.x);

    if (distance < 100) { // Überprüfe, ob der Charakter in der Nähe der Tür ist
      if (door.isCollidingWithDoor(character)) {
        door.enterDoor(character); // Charakter betritt die Tür
      }
    }
  }

  isCollidingWithDoor(character) {
    const doorCollisionBox = this.getCollisionBox();
    const characterCollisionBox = character.getCollisionBox();
    const isColliding =
      characterCollisionBox.x < doorCollisionBox.x + doorCollisionBox.width &&
      characterCollisionBox.x + characterCollisionBox.width > doorCollisionBox.x &&
      characterCollisionBox.y < doorCollisionBox.y + doorCollisionBox.height &&
      characterCollisionBox.y + characterCollisionBox.height > doorCollisionBox.y;

    return isColliding;
  }
  
  enterDoor(character) {
    this.animateOpening();
    character.isVisible = false;
    setTimeout(() => {
      character.x = this.x + this.width + 50; // Position auf der anderen Seite der Tür
      character.isVisible = true; // Charakter wieder sichtbar machen
      this.checkLevelCompletion(); // Überprüfe, ob der Level abgeschlossen ist
    }, 1000); // Warte 1 Sekunde
  }
  
  animateOpening() {
    let doorOpenFrame = 0;
    const openInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[doorOpenFrame]];
      doorOpenFrame++;
      if (doorOpenFrame >= this.IMAGE_DOOR.length) clearInterval(openInterval);
    }, 100); // Zeigt jede Frame der Tür-Animation
  }

  checkLevelCompletion() {
    const overlay = document.getElementById('level-completed-overlay');
    if (overlay) {
      overlay.classList.add('show');
    }
  }

  static drawDoor(world) {
    if (world.door) {
      world.door.drawFrame(world.ctx); // Zeichnet die Tür
    }
  }

  getCollisionBox() {
    return super.getCollisionBox('door');
  }
}