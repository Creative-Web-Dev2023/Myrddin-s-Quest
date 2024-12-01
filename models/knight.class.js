class Knight extends MovableObject {
  height = 270;
  width = 500;
  y = 240;
  delay = 3000;
  direction = 'left';
  moveRange = 100; // Standardbewegungsbereich
  startX = 800; // Startposition
  isMoving = false;
  isAttacking = false;
  dead = false; // Neuer Zustand für tot

  offset = {
    top: 80,
    bottom: 80,
    left: 200,
    right: 200
  };

  IMAGES_WALKING = [
    'img/knight/walk/walk_0.png',
    'img/knight/walk/walk_1.png',
    'img/knight/walk/walk_2.png',
    'img/knight/walk/walk_3.png',
    'img/knight/walk/walk_4.png',
    'img/knight/walk/walk_5.png',
  ];

  IMAGES_ATTACKING = [
    'img/knight/attack/attack 0.png',
    'img/knight/attack/attack 1.png',
    'img/knight/attack/attack 2.png',
    'img/knight/attack/attack 3.png',
  ];
  
  IMAGES_DEAD = [
    'img/knight/die/death 0.png',
    'img/knight/die/death 1.png',
    'img/knight/die/death 2.png',
    'img/knight/die/death 3.png',

  ];

  constructor(delay = 0, startX = 800, moveRange = 100) {
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.otherDirection = false;  // Hier hinzufügen
    this.loadImage('img/knight/walk/walk_0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.01 + Math.random() * 0.05; // Geschwindigkeit reduziert
   
    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);
  }

  setWorld(world) {
    this.world = world;
  }

  animate() {
    setInterval(() => {
      if (!this.dead && this.isMoving && !this.isAttacking) {
        if (this.direction === 'left') {
          this.moveLeft();
          if (this.x <= this.startX - this.moveRange) {
            this.direction = 'right';
          }
        } else {
          this.moveRight();
          if (this.x >= this.startX + this.moveRange) {
            this.direction = 'left';
          }
        }
      }
    }, 1000 / 30);

    setInterval(() => {
      if (!this.dead) {
        if (this.isMoving && !this.isAttacking) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      } else if (this.currentImage < this.IMAGES_DEAD.length) {
        this.playAnimationOnce(this.IMAGES_DEAD);
      }
    }, 1000 / 6); // Adjusted animation interval
  }

  playAnimationOnce(images) {
    if (this.currentImage < images.length) {
      this.img = this.imageCache[images[this.currentImage]];
      this.currentImage++;
    }
  }

  isDead() {
    return this.dead;
  }

  die() {
    this.dead = true;
    this.isMoving = false; // Stoppe Bewegungen
    this.speed = 0; // Keine Geschwindigkeit mehr
    this.currentImage = 0; // Reset animation frame
    setTimeout(() => {
      this.disappear();
    }, 2000); // Stay on the ground for 2 seconds before disappearing
  }

  disappear() {
    if (this.world && this.world.enemies) {
      const index = this.world.enemies.indexOf(this);
      if (index > -1) {
        this.world.enemies.splice(index, 1);
      }
    }
  }

  /**
   * Kollisionslogik mit dem Charakter.
   */
  checkCollisionWithCharacter(character) {
    if (!this.isDead()) {
      const collision = this.checkCollision(character);
      if (collision && character.isJumping()) {
        this.die(); // Ritter stirbt, wenn Charakter auf ihn springt
      }
    }
  }

  /**
   * Überprüft, ob der Charakter springt.
   */
  checkCollision(character) {
    return (
      character.y + character.height - 20 <= this.y && // Charakter springt
      character.x + character.width > this.x &&
      character.x < this.x + this.width
    );
  }
}