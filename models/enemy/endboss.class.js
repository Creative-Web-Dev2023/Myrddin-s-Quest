/**
 * Class representing the Endboss.
 * @extends Enemy
 */
class Endboss extends Enemy {
  /**
   * Creates an instance of Endboss.
   * @param {number} id - The ID of the Endboss.
   */
  constructor(id) {
    super(id);
    this.loadEnemyImages("troll");
    this.height = 450;
    this.width = 360;
    this.y = 50;
    this.x = 13250;
    this.attackRange = 200;
    this.attackDamage = 20;
    this.speed = 0.5;
    this.deadSound = new Audio("./assets/audio/troll_dead.mp3");
    this.offset = { top: 50, bottom: 20, left: 20, right: 20 };
    this.statusBarEndboss = new EndbossStatusbar();
    this.patrolLeftLimit = 13150;
    this.patrolRightLimit = 13500;
    this.IMAGES_WALK = LOADED_IMAGES.troll.walk;
    this.IMAGES_ATTACK = LOADED_IMAGES.troll.attack;
    this.IMAGES_HURT = LOADED_IMAGES.troll.hurt;
    this.IMAGES_DEAD = LOADED_IMAGES.troll.dead;
    this.animate();
  }

  /**
   * Draws the Endboss on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    if (!this.dead && this.statusBarEndboss) {
      this.updateStatusBarPosition();
      this.statusBarEndboss.draw(ctx);
    }
  }

  takeDamage(damage) {
    if (this.dead) return;
    super.takeDamage(damage);
    this.statusBarEndboss.setPercentage(this.energy);
  }

  getCollisionBox() {
    return {
      x: this.otherDirection
        ? this.x + this.offset.left
        : this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }

  updateStatusBarPosition() {
    this.statusBarEndboss.x =
      this.x + this.width / 2 - this.statusBarEndboss.width / 2;
    this.statusBarEndboss.y = this.y - 40;
    this.statusBarEndboss.setPercentage(this.energy);
  }
  /**
   * Handles the death of the Endboss.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.playAnimation(LOADED_IMAGES.troll.dead, 200);
    if (this.world && this.world.soundOn) {
      this.deadSound.play();
    }
    setTimeout(() => {
      this.removeEnemy();
      if (this.world && this.world.crystal) {
        this.world.crystal.activate();
      }
    }, LOADED_IMAGES.troll.dead.length * 200);
  }

  /**
   * Updates the Endboss's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (this.dead) return;
    this.updateStatusBarPosition(); // Ensure the status bar position is updated
    if (this.isInAttackRange(character)) {
      this.attack(character);
    } else {
      this.startPatrol(this.patrolLeftLimit, this.patrolRightLimit);
    }
  }
  /**
   * Animates the Endboss.
   */
  animate() {
    this.startStandardAnimation();
    this.setCustomInterval(() => {
      if (!this.dead && !this.isAttacking) {
        this.startPatrol(this.patrolLeftLimit, this.patrolRightLimit);
      }
    }, 100);
  }

  /**
   * Checks if the character is in attack range.
   */
  isInAttackRange(character) {
    const distance = Math.abs(this.x - character.x);
    const isFacingCharacter =
      (character.x < this.x && this.otherDirection) ||
      (character.x > this.x && !this.otherDirection);
    return distance < this.attackRange && isFacingCharacter;
  }

  /**
   * Resets the position of the Endboss.
   */
  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.dead = false;
    this.isVisible = true;
  }

  drawImage(ctx) {
    if (!this.img?.complete) return;
    ctx.save();
    if (this.otherDirection) {
      ctx.translate(this.x + this.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, 0, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }
}
