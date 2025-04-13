/**
 * Class representing a Knight enemy.
 * @extends Enemy
 */
class Knight extends Enemy {
  /**
   * Creates an instance of Knight.
   * @param {number} [delay=0] - The delay before the knight starts moving.
   * @param {number} [startX=800] - The starting x position of the knight.
   * @param {number} [moveRange=100] - The range within which the knight can move.
   * @param {number} [id] - The ID of the knight.
   */
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

  /**
   * Animates the knight.
   */
  animate() {
    this.setCustomInterval(() => {
      if (this.dead) return; // ❗ Tod? Dann nicht weitermachen
      if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
  
  /**
   * Gets the attack box of the knight.
   * @param {Object} knightBox - The collision box of the knight.
   * @returns {Object} The attack box of the knight.
   */
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

  /**
   * Checks if the character is in attack range.
   * @param {Object} attackBox - The attack box of the knight.
   * @param {Object} characterBox - The collision box of the character.
   * @returns {boolean} True if the character is in attack range, false otherwise.
   */
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

  /**
   * Attacks the character if in range.
   * @param {Character} character - The character to attack.
   */
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

  /**
   * Updates the knight's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (!character) {
      return;
    }
    super.update(character);
    this.healthDisplay.updatePosition(this.x, this.y);
    this.healthDisplay.energy = this.energy;
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

  /**
   * Handles the knight being hit.
   * @param {number} damage - The amount of damage to take.
   */
  hit(damage) {
    this.takeDamage(damage);
    if (this.isDead()) {
      this.playDeathAnimation();
      this.removeEnemy();
    } else if (this.isHurt()) {
      this.playHurtAnimation();
    }
  }

  /**
   * Makes the knight take damage.
   * @param {number} amount - The amount of damage to take.
   */
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

  /**
   * Plays the hurt animation.
   */
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

  /**
   * Handles the knight's death.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.isMoving = false;
    this.clearAllIntervals();
    this.playDeathAnimation();
    setTimeout(() => this.remove(), this.IMAGES_DEAD.length * 300 + 500);
  }
  

  /**
   * Plays the death animation.
   */
  playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    this.clearAllIntervals();
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
    this.animateDeath();
  }
 /**
 * Stoppt alle laufenden Intervalle des Ritters.
 */
clearAllIntervals() {
  this.intervalIDs.forEach(clearInterval);
  this.intervalIDs = [];
}

  /**
   * Animates the death of the knight.
   */
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
    },400);
  }

  /**
   * Removes the knight from the world.
   */
  remove() {
    this.removeEnemy();
  }
}
