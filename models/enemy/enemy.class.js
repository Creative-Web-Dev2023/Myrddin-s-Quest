/**
 * Class representing a generic enemy.
 * @extends MovableObject
 */
class Enemy extends MovableObject {
  static nextId = 1;

  /**
   * Creates an instance of Enemy.
   * @param {number} [id] - The ID of the enemy.
   */
  constructor(id) {
    super();
    this.deadAnimationPlayed = false; 
    this.id = id || Enemy.nextId++;
    this.energy = 100;
    this.dead = false;
    this.isAttacking = false;
    this.deathAnimationPlayed = false;
    this.isRemoved = false;
    this.speed = 1;
    this.attackRange = 150;
    this.attackDamage = 10;
    this.otherDirection = false;
    this.intervalIDs = [];
  }

  /**
   * Sets the world for the enemy.
   * @param {Object} world - The world object.
   */
  setWorld(world) {
    this.world = world;
    if (!world.enemies.includes(this)) {
      world.enemies.push(this);
    }
  }

  /**
   * Patrols the area by moving left or right.
   */
  patrol() {
    if (this.dead) return;
    this.x += this.otherDirection ? -this.speed : this.speed;
  }

  /**
   * Updates the enemy's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (this.isDead()) return;
    if (this.isInAttackRange(character)) {
      this.attack(character);
    } else {
      this.patrol();
    }
  }

  /**
   * Checks if the character is in attack range.
   * @param {Character} character - The character to check.
   * @returns {boolean} True if the character is in attack range, false otherwise.
   */
  isInAttackRange(character) {
    const distance = Math.abs(this.x - character.x);
    return distance < this.attackRange;
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
      const characterBox = character.getCollisionBox();
      const thisBox = this.getCollisionBox();
      const isStillInRange =
        thisBox.x < characterBox.x + characterBox.width &&
        thisBox.x + thisBox.width > characterBox.x &&
        thisBox.y < characterBox.y + characterBox.height &&
        thisBox.y + thisBox.height > characterBox.y;
      if (isStillInRange) {
        character.takeDamage(this.attackDamage);
      }
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }, 400);
  }

  /**
   * Removes the enemy from the world.
   */
  removeEnemy() {
    if (!this.world || !this.world.enemies) return;
    const index = this.world.enemies.indexOf(this);
    if (index > -1) {
      this.world.enemies.splice(index, 1);
    }
  }

  /**
   * Checks if the enemy is dead.
   * @returns {boolean} True if the enemy is dead, false otherwise.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Checks if the enemy is hurt.
   * @returns {boolean} True if the enemy is hurt, false otherwise.
   */
  takeDamage(damage) {
    if (this.energy <= 0 || this.invulnerable) return;
    try {
      playEnemyHitSound();
    } catch (e) {
      console.error("Sound error:", e);
    }
    this.energy -= damage;
    this.energy = Math.max(0, this.energy); 
    if (this.statusBar) {
      this.statusBar.setPercentage(this.energy); 
    }
    if (this.energy > 0) {
      this.playAnimation(this.IMAGES_HURT);
    } else {
      this.die();
    }
  }

  /**
   * Makes the enemy take damage.
   */
  isColliding(mo) {
    if (!(mo instanceof DrawableObject)) return false;
    const colliding =
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height;
  }

  /**
   * Adds intervals so they can be stopped later.
   * @param {Function} fn - The function to execute.
   * @param {number} interval - The interval time in milliseconds.
   */
  setCustomInterval(fn, interval) {
    const id = setInterval(fn, interval);
    this.intervalIDs.push(id);
  }

  /**
   * Stops all set intervals.
   */
  stopAllIntervals() {
    this.intervalIDs.forEach((id) => clearInterval(id));
    this.intervalIDs = [];
  }

  /**
   * Starts the movement of the enemy.
   */
  startMovement() {
    this.setCustomInterval(() => {
      if (!this.isDead()) {
        this.x += this.otherDirection ? -this.speed : this.speed;
      }
    }, 50);
  }

  /**
   * Starts the animation of the enemy.
   */
  startAnimation() {
    this.setCustomInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  /**
   * Restarts the enemy's state.
   */
  restart() {
    this.stopAllIntervals();
    this.x = this.initialX;
    this.y = this.initialY;
    this.energy = 100;
    this.startMovement();
    this.startAnimation();
  }
}
