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
      "img/knight/attack/attack0.png",
      "img/knight/attack/attack1.png",
      "img/knight/attack/attack2.png",
      "img/knight/attack/attack3.png",
      "img/knight/attack/attack4.png",
      "img/knight/attack/attack5.png",
      "img/knight/attack/attack6.png",
    ];
    this.IMAGES_HURT = [
      "img/knight/hurt/hurt0.png",
      "img/knight/hurt/hurt1.png",
    ];
    this.IMAGES_DEAD = [
      "img/knight/death/death0.png",
      "img/knight/death/death1.png",
      "img/knight/death/death2.png",
      "img/knight/death/death3.png",
      "img/knight/death/death4.png",
      "img/knight/death/death5.png",
    ];
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImage(this.IMAGES_WALKING[0]);
    this.lastHit = 0;
    this.intervalIDs = [];
    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);
  }

  animate() {
    this.setCustomInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  getAttackBox(knightBox) {
    return {
      x: this.otherDirection
        ? knightBox.x - this.attackRange
        : knightBox.x + knightBox.width,
      y: knightBox.y,
      width: this.attackRange,
      height: knightBox.height,
    };
  }

  isInAttackRange(attackBox, characterBox) {
    if (!characterBox) {
      return false;
    }
    return (
      attackBox.x < characterBox.x + characterBox.width &&
      attackBox.x + attackBox.width > characterBox.x &&
      attackBox.y < characterBox.y + characterBox.height &&
      attackBox.y + attackBox.height > characterBox.y
    );
  }

  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
    setTimeout(() => {
      this.isAttacking = false;
      if (
        character &&
        this.isInAttackRange(
          this.getAttackBox(this.getCollisionBox()),
          character.getCollisionBox()
        )
      ) {
        character.takeDamage(this.attackDamage);
      }
    }, 800);
  }

  update(character) {
    if (!character) {
      return;
    }
    super.update(character);
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
    this.animateDeath();
  }

  animateDeath() {
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
