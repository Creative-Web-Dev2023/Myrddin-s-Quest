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
  constructor(delay, startX, moveRange) {
    super(); 
    this.loadEnemyImages("knight"); 
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
    this.statusBar = new StatusBar();
    this.statusBar.x = this.x + this.width / 2 - this.statusBar.width / 2;
    this.statusBar.y = this.y - 20;

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
    this.startStandardAnimation();
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
    this.playAnimation(LOADED_IMAGES.knight.attack);
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
  onTakeDamage() {
    this.statusBar.setPercentage(this.energy); 
  }

  /**
   * Plays the hurt animation.
   */
  playHurtAnimation() {
    this.stopAllIntervals();
    let hurtIndex = 0;
    const hurtInterval = setInterval(() => {
      if (hurtIndex < LOADED_IMAGES.knight.hurt.length) {
        this.img = this.imageCache[`hurt_${hurtIndex}`];
        hurtIndex++;
      } else {
        clearInterval(hurtInterval);
        this.startNormalAnimation();
      }
    }, 150);
    this.intervalIDs.push(hurtInterval);
  }
  /**
   * Starts the normal animation after being hurt.
   */
  startNormalAnimation() {
    if (!this.dead) {
      this.animate();
    }
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
    setTimeout(
      () => this.remove(),
      LOADED_IMAGES.knight.dead.length * 300 + 500
    );
  }

  /**
   * Plays the death animation.
   */
  playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    this.clearAllIntervals();
    this.currentImage = 0;
    this.img = this.imageCache["dead_0"];
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
      if (deathIndex < LOADED_IMAGES.knight.dead.length) {
        this.img = this.imageCache[`dead_${deathIndex}`];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        setTimeout(() => {
          this.isRemoved = true;
        }, 1000);
      }
    }, 400);
  }

  /**
   * Removes the knight from the world.
   */
  remove() {
    this.removeEnemy();
  }
}
