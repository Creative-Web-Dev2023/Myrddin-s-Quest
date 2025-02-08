class Snake extends Enemy {
  constructor(startX = 400, moveRange = 100, id) {
    super(id);
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 150;
    this.y = 320;
    this.energy = 10;
    this.dead = false;
    this.attackDamage = 10;
    this.attackRange = 50;
    this.speed = 0.5;
    this.otherDirection = true;
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
    this.IMAGES_HURT = [
      "img/snake/hurt/hurt 000.png",
      "img/snake/hurt/hurt 001.png",
    ];
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
    this.animate();
  }

  setWorld(world) {
    this.world = world;
  }

  checkForAttack(character) {
    const endbossBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: endbossBox.x - this.attackRange,
      y: endbossBox.y,
      width: this.attackRange * 2,
      height: endbossBox.height,
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
    this.playAnimation(this.IMAGES_ATTACKING);
    setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const endbossBox = this.getCollisionBox();
      const isStillInRange =
        endbossBox.x < characterBox.x + characterBox.width &&
        endbossBox.x + endbossBox.width > characterBox.x &&
        endbossBox.y < characterBox.y + characterBox.height &&
        endbossBox.y + endbossBox.height > characterBox.y;
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
    if (this.img && this.img.complete) {
      if (this.otherDirection) {
        ctx.save();
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.img, 0, this.y, this.width, this.height);
        ctx.restore();
      } else {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }
  }

  takeDamage(damage) {
    if (!this.dead) {
      this.energy -= damage;
      if (this.energy <= 0) {
        this.energy = 0;
        this.die();
      } else {
        this.playAnimation(this.IMAGES_HURT);
      }
    }
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.deathAnimationPlayed = true;
      this.dead = true;
      this.playAnimation(this.IMAGES_DEAD);
      setTimeout(() => {
        if (this.world) {
          this.removeEnemy();
        }
      }, 1000);
    }
  }

  remove() {
    this.removeEnemy();
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }

  isDead() {
    return this.dead;
  }
}
