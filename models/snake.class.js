class Snake extends Enemy {
  constructor(startX = 400, moveRange = 100, id) {
    super(id); // ID an den Konstruktor der Basisklasse übergeben
    console.log(`Schlange erstellt mit ID: ${this.id}`); // Debugging

    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 150;
    this.y = 320; 
    this.energy = 10;
    this.isAttacking = false; 
    this.isMoving = true; 
    this.dead = false; 
    this.attackDamage = 10;
    this.attackRange = 50;
    this.speed = 0.5;
    this.direction = "left";
    this.attackIntervall = null;
    this.offset = { top: 60, bottom: 60, left: 50, right: 50 };
    
    this.IMAGES_WALKING = [
      "img/snake/walk/Walk1.png",
      "img/snake/walk/Walk2.png",
      "img/snake/walk/Walk3.png",
      "img/snake/walk/Walk4.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/snake/attack/attack 000.png",
      "img/snake/attack/attack 001.png",
      "img/snake/attack/attack 002.png",
      "img/snake/attack/attack 003.png",
    ];
    this.IMAGES_HURT = ["img/snake/hurt/hurt 000.png", "img/snake/hurt/hurt 001.png"];
    this.IMAGES_DEAD = [
      "img/snake/die/die 000.png",
      "img/snake/die/die 001.png",
      "img/snake/die/die 002.png",
      "img/snake/die/die 003.png",
    ];

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate(); // Stelle sicher, dass die animate Methode aufgerufen wird
  }

  setWorld(world) {
    this.world = world;
    console.log(`Welt gesetzt für Schlange mit ID: ${this.id}, world:`, this.world); // Debugging
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

  draw(ctx) {
    super.draw(ctx);
  }

  takeDamage(damage) {
    if (!this.dead) {
      this.energy = Math.max(0, this.energy - damage);
      console.log(`Schlange nimmt Schaden: ${damage}, verbleibende Energie: ${this.energy}`);
      if (this.energy <= 0) {
        this.dead = true;
        this.playDeathAnimation();
        setTimeout(() => {
          if (this.world) {
            this.remove(); // Verwenden Sie die eigene remove-Methode
          } else {
            console.log('Welt nicht definiert');
          }
        }, 1000);
      } else {
        this.playAnimation(this.IMAGES_HURT);
      }
    }
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.deathAnimationPlayed = true;
      this.dead = true;
      console.log('Todesanimation abspielen');
      this.playAnimation(this.IMAGES_DEAD);
      setTimeout(() => {
        if (this.world) {
          this.remove(); // Verwenden Sie die eigene remove-Methode
        } else {
          console.log('Welt nicht definiert');
        }
      }, 3000);
    }
  }

  remove() {
    if (this.world && this.world.enemies) {
      const snakeIndex = this.world.enemies.findIndex((snake) => snake.id === this.id);
      if (snakeIndex !== -1) {
        this.world.enemies.splice(snakeIndex, 1);
        console.log('Schlange entfernt');
      } else {
        console.log('Schlange nicht gefunden');
      }
    } else {
      console.log('Welt oder Feinde nicht definiert');
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

  onCharacterJump(character) {
    if (!this.dead) {
      console.log('Charakter springt auf Schlange');
      this.takeDamage(this.energy); // Schlange sofort töten
      character.jump(); // Charakter springt zurück
    }
  }
}
