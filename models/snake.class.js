class Snake extends MovableObject {
  height = 100;
  width = 150;
  y = 350;
  isMoving = true; // Schlange bewegt sich immer
  direction = 'left';
  moveRange = 200; // Standardbewegungsbereich
  startX = 1200; // Startposition geändert, damit die Schlange von rechts kommt
  isIdle = false; // Schlange ist nicht idle
  attackCooldown = false;

  offset = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  };

  IMAGES_WALKING = [
    'img/snake/walk/Walk1.png',
    'img/snake/walk/Walk2.png',
    'img/snake/walk/Walk3.png',
    'img/snake/walk/Walk4.png',
  ];

  IMAGES_IDLE = [
    'img/snake/idle/idle 000.png',
    'img/snake/idle/idle 001.png',
    'img/snake/idle/idle 002.png',
    'img/snake/idle/idle 003.png',
  ];

  IMAGES_ATTACKING = [
    'img/snake/attack/attack 000.png',
    'img/snake/attack/attack 001.png',
    'img/snake/attack/attack 002.png',
    'img/snake/attack/attack 003.png',
  ];

  constructor(startX = 1500, moveRange = 200) { // Startposition geändert
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.otherDirection = true; // Schlange schaut nach links
    this.loadImage('img/snake/walk/Walk1.png'); // Stellen Sie sicher, dass dieser Pfad korrekt ist
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE); // Lade Idle-Bilder
    this.loadImages(this.IMAGES_ATTACKING); // Lade Angriffs-Bilder
    this.speed = 0.02 + Math.random() * 0.05; // Geschwindigkeit reduziert
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.direction === 'left') {
        this.moveLeft();
        if (this.x <= this.startX - this.moveRange) {
          this.direction = 'right';
          this.otherDirection = false; // Richtungswechsel
        }
      } else {
        this.moveRight();
        if (this.x >= this.startX + this.moveRange) {
          this.direction = 'left';
          this.otherDirection = true; // Richtungswechsel
        }
      }
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 5);

    setInterval(() => {
      this.checkCharacterProximity();
    }, 1000 / 10); // Check proximity every 100ms
  }

  checkCharacterProximity() {
    if (this.world && this.world.character) {
      const distance = Math.abs(this.x - this.world.character.x);
      if (distance < 100) { // Adjust the distance threshold as needed
        this.attackCharacter(this.world.character);
      }
    }
  }

  attackCharacter(character) {
    if (this.attackCooldown) return;

    if (!this.isDead() && !character.isDead()) {
      character.hit(this); // Character takes damage from the snake
    }

    this.attackCooldown = true;
    setTimeout(() => {
      this.attackCooldown = false;
    }, 1500); // 1,5 Sekunden Abklingzeit
  }

  getCollisionBox() {
    return super.getCollisionBox('snake');
  }

  drawCollisionBox(ctx) {
    super.drawCollisionBox(ctx, 'green');
  }
}

// Stelle sicher, dass die Klasse global verfügbar ist
window.Snake = Snake;

