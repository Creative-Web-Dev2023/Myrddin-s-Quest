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
    return {
      x: this.x + this.offset.left, // Verschiebung der Kollisionsbox
      y: this.y + this.offset.top, // Höhe anpassen, da die Schlange kriecht
      width: this.width * 0.8, // Kollisionsbox etwas kleiner machen
      height: this.height * 0.2 // Nur die untere Hälfte berücksichtigen
    };
  }

  jump() {
    this.isVisible = false; // Make the snake invisible
    setTimeout(() => {
      this.isVisible = true; // Make the snake visible again after 2 seconds
    }, 2000);
  }

  takeDamage(damage) {
    if (this.energy > 0) { // Check if the snake is alive
      this.energy -= damage; // Reduce the energy of the snake
      this.playAnimation(this.IMAGES_HURT);

      if (this.energy <= 0) { // Check if the snake has died
        this.energy = 0; // Set the energy to 0
        this.die(); // Schlange stirbt, wenn Energie 0 ist
      }
    } else {
      console.log("Snake is dead.");
    }
  }

  die() {
    if (!this.isDead) {
      this.isDead = true;
      this.playAnimation(this.IMAGES_DEAD); // Zeige Sterbeanimation
      setTimeout(() => {
        this.removeSnake(); // Entferne die Schlange nach 3 Sekunden
      }, 3000);
    }
  }

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD); // Play dead animation frames for the snake
    setTimeout(() => {
      this.removeSnake(); // Remove the snake after a delay
    }, 3000); // Delay before removing the snake
  }

  removeSnake() {
    if (this.world && this.world.snakes) { // Check if this.world and this.world.snakes are defined
      const snakeIndex = this.world.snakes.findIndex(snake => snake.id === this.id);  // Find the snake by id
      if (snakeIndex !== -1) { // Check if the snake is found
        this.world.snakes.splice(snakeIndex, 1); // Remove the snake from the array
      }
    }
  }
}



