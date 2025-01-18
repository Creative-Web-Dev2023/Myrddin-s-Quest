class Knight extends Enemy {
  constructor(delay = 0, startX = 800, moveRange = 100, id) {
      super(id);
      this.x = startX;
      this.startX = startX;
      this.moveRange = moveRange;
      this.energy = 30;
      this.speed = 0.01 + Math.random() * 0.05;
      this.otherDirection = true;
      this.attackDamage = 20;
      this.attackRange = 50;
      this.width = 520; // Set the width of the knight
      this.height = 290; // Set the height of the knight
      this.y = 190; // Set the y position of the knight
      this.offset = { top: 120, bottom: 70, left: 210, right: 210 };
      this.healthDisplay = new KnightHealthDisplay(); // Initialize the health display
      this.healthDisplay.energy = this.energy;
      this.IMAGES_WALKING = [
          "img/knight/walk/walk 0.png",
          "img/knight/walk/walk 1.png",
          "img/knight/walk/walk 2.png",
          "img/knight/walk/walk 3.png",
          "img/knight/walk/walk 4.png",
          "img/knight/walk/walk 5.png",
      ];
      this.IMAGES_ATTACKING = [
          "img/knight/attack/attack 0.png",
          "img/knight/attack/attack 1.png",
          "img/knight/attack/attack 2.png",
          "img/knight/attack/attack 3.png",
          "img/knight/attack/attack 4.png",
          "img/knight/attack/attack 5.png",
          "img/knight/attack/attack 6.png",
      ];
      this.IMAGES_HURT = ["img/knight/hurt/hurt 0.png", "img/knight/hurt/hurt 1.png"];
      this.IMAGES_DEAD = [
          "img/knight/death/death 0.png",
          "img/knight/death/death 1.png",
          "img/knight/death/death 2.png",
          "img/knight/death/death 3.png",
          "img/knight/death/death 4.png",
          "img/knight/death/death 5.png",
      ];
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_ATTACKING);
      this.loadImages(this.IMAGES_HURT);
      this.loadImages(this.IMAGES_DEAD);
      this.loadImage(this.IMAGES_WALKING[0]); // Set the initial image for the knight
      setTimeout(() => {
          this.isMoving = true;
          this.animate();
      }, delay);
  }

  handleMovement() {
      if (!this.dead && this.isMoving) {
          this.moveLeft();
          this.otherDirection = true;
          if (this.x <= this.startX - this.moveRange || this.x >= this.startX + this.moveRange) {
            this.otherDirection = !this.otherDirection;
        }        
      }
  }

  checkForAttack(character) {
      const knightBox = this.getCollisionBox();
      const characterBox = character.getCollisionBox();
      const attackBox = {
          x: this.otherDirection ? knightBox.x - this.attackRange : knightBox.x + knightBox.width,
          y: knightBox.y,
          width: this.attackRange,
          height: knightBox.height,
      };
      const isInAttackRange = attackBox.x < characterBox.x + characterBox.width &&
          attackBox.x + attackBox.width > characterBox.x &&
          attackBox.y < characterBox.y + characterBox.height &&
          attackBox.y + attackBox.height > characterBox.y;
      if (isInAttackRange && !this.isAttacking) {
          this.attack(character);
      }
  }

  update(character) {
      this.checkForAttack(character);
      this.healthDisplay.updatePosition(this.x, this.y); // Update the health display position
      this.healthDisplay.energy = this.energy; // Update the health display energy
  }

  draw(ctx) {
      super.draw(ctx);
      this.healthDisplay.updatePosition(this.x, this.y);
      this.healthDisplay.draw(ctx);
  }

  hit(damage) {
      this.takeDamage(damage);
      if (this.isDead()) {
          this.playDeathAnimation();
          this.removeEnemy();
      } else if (this.isHurt()) {
          this.playHurtAnimation();
      }
  }
  
  takeDamage(damage) {
      if (!this.dead) {
        this.energy = Math.max(0, this.energy - 10);
        this.healthDisplay.energy = this.energy; 
        if (this.energy <= 0) {
          this.dead = true;
          this.playDeathAnimation();
          setTimeout(() => {
            const knightIndex = this.world.enemies.findIndex(
              (knight) => knight.id === this.id
            );
            if (knightIndex !== -1) {
              this.world.enemies.splice(knightIndex, 1);
            }
          }, 1000);
        } else {
          this.playAnimation(this.IMAGES_HURT);
        }
      }
    }

  remove() {
      this.removeEnemy(); // Verwenden Sie die Methode der Basisklasse
  }
}