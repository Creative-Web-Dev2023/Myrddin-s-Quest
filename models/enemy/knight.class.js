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
    this.width = 520;
    this.height = 290;
    this.y = 190;
    this.offset = { top: 120, bottom: 70, left: 210, right: 210 };
    this.healthDisplay = new KnightHealthDisplay(this);
    this.IMAGES_WALKING = [
      "img/knight/walk/walk0.png",
      "img/knight/walk/walk1.png",
      "img/knight/walk/walk2.png",
      "img/knight/walk/walk3.png",
      "img/knight/walk/walk4.png",
      "img/knight/walk/walk5.png",
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
    this.IMAGES_HURT = [
      "img/knight/hurt/hurt 0.png",
      "img/knight/hurt/hurt 1.png",
    ];
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
    this.loadImage(this.IMAGES_WALKING[0]);
    this.lastHit = 0;
    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);
    this.play
  }
    animate() {
       setInterval(() => {
           if (!this.dead) {
               this.playAnimation(this.IMAGES_WALKING);
           } else {
               this.playAnimation(this.IMAGES_DEAD);
           }
       }, 100);
   }
  handleMovement() {
    if (!this.dead && this.isMoving) {
      this.moveLeft();
      this.otherDirection = true;
      if (
        this.x <= this.startX - this.moveRange ||
        this.x >= this.startX + this.moveRange
      ) {
        this.otherDirection = !this.otherDirection;
      }
    }
  }

  checkForAttack(character) {
    const knightBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: this.otherDirection
        ? knightBox.x - this.attackRange
        : knightBox.x + knightBox.width,
      y: knightBox.y,
      width: this.attackRange,
      height: knightBox.height,
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

  update(character) {
    this.checkForAttack(character);
    this.healthDisplay.updatePosition(this.x, this.y);
    this.healthDisplay.energy = this.energy;
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

  takeDamage(amount) {
    if (this.dead) return;
    const now = Date.now();
    if (now - this.lastHit > 1000) {
      this.energy = Math.max(0, this.energy - amount);
      this.lastHit = now;

      if (this.energy <= 0) {
        this.die();
      } else {
        this.playHurtAnimation();
      }
    }
  }

  playHurtAnimation() {
    let hurtIndex = 0;
    const hurtInterval = setInterval(() => {
      if (hurtIndex < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[hurtIndex]];
        hurtIndex++;
      } else {
        clearInterval(hurtInterval);
      }
    }, 150);
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.isMoving = false;
    this.playDeathAnimation();
    setTimeout(() => this.remove(), 1000);
  }
  
  playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
    let deathIndex = 0;
    const deathInterval = setInterval(() => {
      if (deathIndex < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        setTimeout(() => {
          this.isRemoved = true;
        }, 1000);
      }
    }, 150);
  }

  remove() {
    this.removeEnemy();
  }
}
