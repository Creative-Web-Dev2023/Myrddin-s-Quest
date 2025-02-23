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
    this.height = 450;
    this.width = 360;
    this.y = 50;
    this.x = 13250;
    this.attackRange = 200;
    this.attackDamage = 20;
    this.speed = 0.5;
    this.deadSound = new Audio("audio/troll dead.mp3");
    this.offset = { top: 50, bottom: 20, left: 20, right: 20 };
    this.statusBarEndboss = new EndbossStatusbar();
    this.otherDirection = true;
    this.energy = 100;
    this.patrolLeftLimit = 13150;
    this.patrolRightLimit = 13500;
    this.statusBarEndboss.setPercentage(this.energy);
    this.initialX = this.x;
    this.initialY = this.y;

    this.IMAGES_WALKING = [
      "img/troll/walk/walk_000.png",
      "img/troll/walk/walk_001.png",
      "img/troll/walk/walk_002.png",
      "img/troll/walk/walk_003.png",
      "img/troll/walk/walk_004.png",
      "img/troll/walk/walk_005.png",
      "img/troll/walk/walk_006.png",
      "img/troll/walk/walk_007.png",
      "img/troll/walk/walk_008.png",
      "img/troll/walk/walk_009.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/troll/attack/attack_000.png",
      "img/troll/attack/attack_001.png",
      "img/troll/attack/attack_002.png",
      "img/troll/attack/attack_003.png",
      "img/troll/attack/attack_004.png",
      "img/troll/attack/attack_005.png",
      "img/troll/attack/attack_006.png",
      "img/troll/attack/attack_007.png",
      "img/troll/attack/attack_008.png",
      "img/troll/attack/attack_009.png",
    ];
    this.IMAGES_HURT = [
      "img/troll/hurt/hurt_000.png",
      "img/troll/hurt/hurt_001.png",
      "img/troll/hurt/hurt_002.png",
      "img/troll/hurt/hurt_003.png",
      "img/troll/hurt/hurt_004.png",
      "img/troll/hurt/hurt_005.png",
      "img/troll/hurt/hurt_006.png",
      "img/troll/hurt/hurt_007.png",
      "img/troll/hurt/hurt_008.png",
      "img/troll/hurt/hurt_009.png",
    ];
    this.IMAGES_DEAD = [
      "img/troll/die/die_000.png",
      "img/troll/die/die_001.png",
      "img/troll/die/die_002.png",
      "img/troll/die/die_003.png",
      "img/troll/die/die_004.png",
      "img/troll/die/die_005.png",
      "img/troll/die/die_006.png",
      "img/troll/die/die_007.png",
      "img/troll/die/die_008.png",
      "img/troll/die/die_009.png",
    ];
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
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
    this.playAnimation(this.IMAGES_ATTACKING, 100);
    setTimeout(() => {
      if (this.isInAttackRange(character)) {
        character.takeDamage(this.attackDamage);
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
      this.playAnimation(this.IMAGES_HURT, 150);
    } else {
      this.die();
    }
  }

  /**
   * Handles the death of the Endboss.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.playAnimation(this.IMAGES_DEAD, 150);
    this.deadSound.play();
    setTimeout(() => {
      this.spawnCrystal();
      this.removeEnemy();
      this.world.character.collectCrystal(this.world.crystal);
      if (
        this.world.endGame &&
        typeof this.world.endGame.showWinScreen === "function"
      ) {
        this.world.endGame.showWinScreen();
      }
    }, this.IMAGES_DEAD.length * 150);
  }

  /**
   * Spawns a crystal at the Endboss's position.
   */
  spawnCrystal() {
    if (this.world && this.world.level) {
      const crystal = new Crystal(
        this.x + this.width / 2 - 40,
        this.y + this.height / 2 - 40
      );
      this.world.level.objects.push(crystal);
      this.world.crystal = crystal;
    }
  }

  /**
   * Patrols the area between patrolLeftLimit and patrolRightLimit.
   */
  patrol() {
    if (this.dead) return;
    if (this.x <= this.patrolLeftLimit) {
      this.otherDirection = false;
    } else if (this.x >= this.patrolRightLimit) {
      this.otherDirection = true;
    }
    this.x += this.otherDirection ? -this.speed : this.speed;
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
    setInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD, 250);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING, 100);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT, 250);
      } else {
        this.playAnimation(this.IMAGES_WALKING, 150);
      }
    }, 100);
  }

  /**
   * Checks if the character is in attack range.
   * @param {Character} character - The character to check.
   * @returns {boolean} True if the character is in attack range, false otherwise.
   */
  isInAttackRange(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
  }

  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.dead = false;
    this.isVisible = true;
  }
}
