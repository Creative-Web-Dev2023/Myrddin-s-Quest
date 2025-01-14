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
    const door = world.door;
    const character = world.character;
    if (character.hasKey && character.isColliding(door)) {
      character.enterDoor();
      setTimeout(() => {
        world.levelCompleted = true;
        continueToNextLevel();
      }, 2000);
    }
  }

  isCollidingWithDoor(character) {
    const box1 = this.getCollisionBox();
    const box2 = character.getCollisionBox();
    const isColliding = (
      box1.x < box2.x + box2.width &&  // Linke Seite von box1 vor der rechten Seite von box2
      box1.x + box1.width > box2.x &&  // Rechte Seite von box1 hinter der linken Seite von box2
      box1.y < box2.y + box2.height && // Oberseite von box1 über der Unterseite von box2
      box1.y + box1.height > box2.y    // Unterseite von box1 unter der Oberseite von box2
    );

    return isColliding;
  }
  
  
  enterDoor(character) {
    character.enterDoor(this); // Übergibt die Tür an die Charakter-Methode
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
    const box = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
    };
    return box;
  }
}