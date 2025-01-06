class Snake extends MovableObject {
  height = 150;
  width = 250;
  y = 300;
  isMoving = true; // Schlange bewegt sich immer
  direction = "left"; // Richtung fixieren
  moveRange = 100; // Reduzierte Bewegungsreichweite
  startX = 400; // Angepasste Startposition
  isAttacking = false; // Track if the snake is attacking
  energy = 10; // Snake hat 10 Lebenspunkte
  speed = 0.5; // Reduzierte Grundgeschwindigkeit
  dead = false;
  attackDamage = 10; // Schaden der Schlange
  attackRange = 50; // Reichweite des Angriffs
  attackInterval = null; // Intervall für den Angriff

  offset = {
    top: 60,
    bottom: 60,
    left: 50,
    right: 50,
  };

  IMAGES_WALKING = [
    "img/snake/walk/Walk1.png",
    "img/snake/walk/Walk2.png",
    "img/snake/walk/Walk3.png",
    "img/snake/walk/Walk4.png",
  ];

  IMAGES_IDLE = [
    "img/snake/idle/idle 000.png",
    "img/snake/idle/idle 001.png",
    "img/snake/idle/idle 002.png",
    "img/snake/idle/idle 003.png",
  ];

  IMAGES_ATTACKING = [
    "img/snake/attack/attack 000.png",
    "img/snake/attack/attack 001.png",
    "img/snake/attack/attack 002.png",
    "img/snake/attack/attack 003.png",
  ];

  IMAGES_HURT = ["img/snake/hurt/hurt 000.png", "img/snake/hurt/hurt 001.png"];

  IMAGES_DEAD = [
    "img/snake/die/die 000.png",
    "img/snake/die/die 001.png",
    "img/snake/die/die 002.png",
    "img/snake/die/die 003.png",
  ];

  constructor(startX = 400, moveRange = 100, id) {
    super();
    this.id = id;
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  setWorld(world) {
    this.world = world;
  }

  animate() {
    this.movementInterval = setInterval(() => {
      this.handleMovement();
    }, 500 / 2);

    this.animationInterval = setInterval(() => {
      this.handleAnimation();
    }, 500 / 5);

    this.attackAnimationInterval = setInterval(() => {
      if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      }
    }, 500 / 2);
  }

  handleMovement() {
    if (!this.dead && this.isMoving) {
      this.moveLeft(); // Immer nach links bewegen
    }
  }

  handleAnimation() {
    if (this.dead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACKING); // Immer Angriff nach links
    } else if (this.isMoving) {
      this.playAnimation(this.IMAGES_WALKING); // Immer nach links gehen
    }
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.deathAnimationPlayed = true;
      this.dead = true;
      this.playAnimation(this.IMAGES_DEAD);
      setTimeout(() => {
        setTimeout(() => {
          this.removeSnake();
        }, 1000);
      }, 3000);
    }
  }

  die() {
    if (!this.isDead()) {
      this.dead = true;
      this.playDeathAnimation();
    }
  }

  isHurt() {
    return this.energy < 100 && this.energy > 0;
  }

  isDead() {
    return this.energy <= 0 || this.dead;
  }

  hit(damage) {
    if (this.isDead() || this.deathAnimationPlayed) return;
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
      this.playDeathAnimation();
    }
  }

  checkForAttack(character) {
    const snakeBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();

    const attackBox = {
      x: snakeBox.x - this.attackRange, // Angriff immer nach links
      y: snakeBox.y,
      width: this.attackRange,
      height: snakeBox.height,
    };

    const isInAttackRange =
      attackBox.x < characterBox.x + characterBox.width &&
      attackBox.x + attackBox.width > characterBox.x &&
      attackBox.y < characterBox.y + characterBox.height &&
      attackBox.y + attackBox.height > characterBox.y;

    if (isInAttackRange && !this.isAttacking) {
      this.attack(character);
    }
  }

  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAttackAnimation();

    setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const snakeBox = this.getCollisionBox();
      const isStillInRange =
        snakeBox.x < characterBox.x + characterBox.width &&
        snakeBox.x + snakeBox.width > characterBox.x &&
        snakeBox.y < characterBox.y + characterBox.height &&
        snakeBox.y + snakeBox.height > characterBox.y;
      if (isStillInRange) {
        character.takeDamage(this.attackDamage);
      }
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }, 400);
  }

  playAttackAnimation() {
    this.playAnimation(this.IMAGES_ATTACKING);
  }

  update(character) {
    this.checkForAttack(character);
  }

  removeSnake() {
    if (this.world && this.world.snakes) {
      const snakeIndex = this.world.snakes.findIndex((snake) => snake.id === this.id);
      if (snakeIndex !== -1) {
        this.world.snakes.splice(snakeIndex, 1);
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }

  takeDamage(damage) {
    if (!this.dead) {
      this.energy = Math.max(0, this.energy - 10);
      if (this.energy <= 0) {
        this.dead = true;
        this.playDeathAnimation();
        setTimeout(() => {
          const snakeIndex = this.world.enemies.findIndex((snake) => snake.id === this.id);
          if (snakeIndex !== -1) {
            this.world.enemies.splice(snakeIndex, 1);
          }
        }, 1000);
      } else {
        this.playAnimation(this.IMAGES_HURT);
      }
    }
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }
}
