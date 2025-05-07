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
    super();
    this.loadEnemyImages("troll");

    this.deadAnimationPlayed = false;
    this.height = 450;
    this.width = 360;
    this.y = 50;
    this.x = 13250;
    this.attackRange = 200;
    this.attackDamage = 20;
    this.attackAnimationSpeed = 100;
    this.hurtAnimationSpeed = 250;
    this.walkAnimationSpeed = 150;
    this.speed = 0.5;
    this.deadSound = new Audio("./assets/audio/troll_dead.mp3");
    this.offset = { top: 50, bottom: 20, left: 20, right: 20 };
    this.statusBarEndboss = new EndbossStatusbar();
    this.otherDirection = true;
    this.energy = 100;
    this.patrolLeftLimit = 13150;
    this.patrolRightLimit = 13500;
    this.statusBarEndboss.setPercentage(this.energy);
    this.initialX = this.x;
    this.initialY = this.y;

    this.animate();
  }

  /**
   * Sets the world for the Endboss.
   * @param {Object} world - The world object.
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Attacks the character if it is in range and not already attacking.
   * @param {Character} character - The character to attack.
   */
  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(LOADED_IMAGES.troll.attack, 100);
    setTimeout(() => {
      if (this.isInAttackRange(character)) {
        character.takeDamage(this.attackDamage);
        this.takeDamage(character.attackDamage);
      }
    }, 300);
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }

  /**
   * Takes damage and dies if energy is 0 or less.
   * @param {number} damage - The amount of damage to take.
   */
  takeDamage(damage) {
    if (this.dead) return;
    this.energy -= damage;
    this.energy = Math.max(0, this.energy);
    this.statusBarEndboss.setPercentage(this.energy);
    if (this.energy > 0) {
      this.playAnimation(LOADED_IMAGES.troll.hurt);
    } else {
      this.playAnimation(LOADED_IMAGES.troll.hurt);
      setTimeout(() => {
        this.die();
      }, LOADED_IMAGES.troll.hurt.length * 250);
    }
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
   * Patrols the area between patrolLeftLimit and patrolRightLimit.
   */
  patrol() {
    this.startPatrol(this.patrolLeftLimit, this.patrolRightLimit);
  }
  /**
   * Updates the Endboss's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (this.dead) return;
    if (this.isInAttackRange(character)) {
      this.attack(character);
    } else {
      this.patrol();
    }
  }

  /**
   * Draws the Endboss on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.save();
    this.drawImage(ctx);
    ctx.restore();
    this.updateStatusBarPosition();
    this.statusBarEndboss.setPercentage(this.energy);
    this.statusBarEndboss.draw(ctx);
  }

  /**
   * Draws the Endboss's image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawImage(ctx) {
    if (this.img && this.img.complete) {
      if (this.otherDirection) {
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(
        this.img,
        this.otherDirection ? 0 : this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  /**
   * Updates the position of the Endboss's status bar.
   */
  updateStatusBarPosition() {
    this.statusBarEndboss.x =
      this.x + this.width / 2 - this.statusBarEndboss.width / 2;
    this.statusBarEndboss.y = this.y - 40;
  }

  /**
   * Animates the Endboss.
   */
  animate() {
    this.startStandardAnimation();
    let i = 0;
    this.setCustomInterval(() => {
      i++;
      if (this.x >= 13250 && this.x <= 13500) {
        this.hadFirstContact = true;
      }
    }, 100);
  }

  //   let i = 0;
  //   setInterval(() => {
  //     if (this.dead && !this.deadAnimationPlayed) {
  //       this.playDeathAnimation();
  //     } else if (this.isAttacking) {
  //       this.playAnimation(LOADED_IMAGES.troll.attack, 100);
  //     } else if (this.isHurt()) {
  //       this.playAnimation(LOADED_IMAGES.troll.hurt, 250);
  //     } else {
  //       this.playAnimation(LOADED_IMAGES.troll.walk, 150);
  //     }
  //     i++;
  //     if (this.x >= 13250 && this.x <= 13500) {
  //       this.hadFirstContact = true;
  //     }
  //   }, 100);

  /**
   * Checks if the character is in attack range.
   */
  isInAttackRange(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
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
}
