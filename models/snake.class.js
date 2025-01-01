class Snake extends MovableObject {
  height = 100;
  width = 150;
  y = 350;
  health = 100; // Initialisiere die Gesundheit der Schlange
  isMoving = true; // Schlange bewegt sich immer
  direction = 'left';
  moveRange = 200; // Standardbewegungsbereich
  startX = 1200; // Startposition geändert, damit die Schlange von rechts kommt
  isIdle = false; // Schlange ist nicht idle
  attackCooldown = false;
  isDead = false; // Track if the snake is dead
  isAttacking = false; // Track if the snake is attacking

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

  IMAGES_DEAD = [
    'img/snake/die/die 000.png',
    'img/snake/die/die 001.png',
    'img/snake/die/die 002.png',
    'img/snake/die/die 003.png',
  ];

  constructor(startX = 1500, moveRange = 200, id) { // Fügen Sie die id hinzu
    super();
    this.id = id; // Initialisieren Sie die id
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.otherDirection = true; // Schlange schaut nach links
    this.loadImage('img/snake/walk/Walk1.png'); // Stellen Sie sicher, dass dieser Pfad korrekt ist
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE); // Lade Idle-Bilder
    this.loadImages(this.IMAGES_ATTACKING); // Lade Angriffs-Bilder
    this.loadImages(this.IMAGES_DEAD); // Lade Dead-Bilder
    this.speed = 0.02 + Math.random() * 0.05; // Geschwindigkeit reduziert
    this.animate();
  }

  animate() {
    this.movementInterval = setInterval(() => {
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
    this.animationInterval = setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
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
    if (!this.isDead && !character.isDead()) {
      character.hit(this); // Character takes damage from the snake
    }
    this.attackCooldown = true;
    this.attack();
    setTimeout(() => {
      this.attackCooldown = false;
    }, 1500); // 1,5 Sekunden Abklingzeit
  }

  
  die( enemy, id) {
    this.isDead = true;
    setTimeout(() => {
      this.isVisible = false; // Make the snake invisible after it dies
      const snakeIndex = this.world.enemies.findIndex(enemies => enemies.id === enemy.id);
      if (snakeIndex !== -1) {
        this.world.enemies.splice(snakeIndex, 1); // Entfernen Sie die Schlange aus dem Array
      }
    }, 500); // Wait 0.5 seconds before making the snake invisible
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000); // Attack animation duration
  }
  getCollisionBox() {
    return super.getCollisionBox('snake');
  }

  checkCollision(object1, object2) {
    const box1 = object1.getHitbox();
    const box2 = object2.getHitbox();

    return (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y
    );
  }


  draw(ctx) {
    super.draw(ctx);
    // drawFrame method call removed
  }
}



