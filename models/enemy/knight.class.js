class Knight extends Enemy {
  constructor(delay, startX, moveRange) {
    super();
    this.loadEnemyImages("knight");
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.energy = 30;
    this.speed = 0.5;
    this.attackDamage = 20;
    this.attackRange = 50;
    this.width = 520;
    this.height = 290;
    this.y = 190;
    this.hits = 0;
    this.maxHits = 3;
    this.offset = { top: 120, bottom: 70, left: 210, right: 210 };
    this.IMAGES_WALK = LOADED_IMAGES.knight.walk;
    this.IMAGES_ATTACK = LOADED_IMAGES.knight.attack;
    this.IMAGES_HURT = LOADED_IMAGES.knight.hurt;
    this.IMAGES_DEAD = LOADED_IMAGES.knight.dead;
    this.healthDisplay = new KnightHealthDisplay(this);

    this.isInvulnerable = false;
    setTimeout(() => {
      this.startPatrol(
        this.startX - this.moveRange,
        this.startX + this.moveRange
      );
      this.startStandardAnimation();
    }, delay);
  }

  isInAttackRange(character) {
    if (!character) return false;
    const distance = Math.abs(this.x - character.x);
    return distance < this.attackRange;
  }

  update() {
    if (this.knight) {
      this.energy = this.knight.energy;
    }
  }

  updateStatusBarPosition() {
    this.statusBar.x = this.x + this.width / 2 - this.statusBar.width / 2;
    this.statusBar.y = this.y - 20;
  }

  startPatrol(leftLimit) {
    if (this.patrolling) return;
    this.patrolling = true;
    this.setCustomInterval(() => {
      if (!this.isAttacking) {
        if (this.x > leftLimit) {
          this.otherDirection = true;
          this.x -= this.speed;
        }
      }
    }, 50);
  }
  /**
   * Draws the knight on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    this.healthDisplay.updatePosition(this.x, this.y);
    this.healthDisplay.draw(ctx);
  }

  attack(character) {
    if (this.dead || this.isAttacking) return;
    super.attack(character);
  }

  takeDamage(damage) {
    if (this.dead || this.isInvulnerable) return;
    this.isInvulnerable = true;
    setTimeout(() => (this.isInvulnerable = false), 500);
    this.hits = Math.min(this.hits + damage, this.maxHits);
    this.energy = 100 - this.hits * (100 / this.maxHits);
    playEnemyHitSound();
    if (this.hits >= this.maxHits) {
      this.die();
    } else {
      this.playAnimation(this.IMAGES_HURT); 
    }
  }
}
