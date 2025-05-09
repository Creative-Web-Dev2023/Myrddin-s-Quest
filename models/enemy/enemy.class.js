const SHOW_DEBUG_BOXES = true;
/**
 * Class representing a generic enemy.
 * @extends MovableObject
 */
class Enemy extends MovableObject {
  static nextId = 1;

  loadEnemyImages(enemyType) {
    const images = LOADED_IMAGES[enemyType];
    this.loadImage(images.walk[0]);
    this.addToImageCache("walk", images.walk);
    this.addToImageCache("idle", images.idle);
    this.addToImageCache("attack", images.attack);
    this.addToImageCache("hurt", images.hurt);
    this.addToImageCache("dead", images.dead);
  }
  /**
   * Creates an instance of Enemy.
   * @param {number} [id] - The ID of the enemy.
   */
  constructor(id) {
    super();
    this.id = id || Enemy.nextId++;
    this.energy = 100;
    this.speed = 1;
    this.attackRange = 150;
    this.attackDamage = 10;
    this.otherDirection = false;
    this.animationIntervals = [];
    this.isVisible = true;
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
 * Removes the enemy from the world.
 */
removeEnemy() {
  if (this.world && this.world.enemies) {
    const index = this.world.enemies.indexOf(this);
    if (index !== -1) {
      this.world.enemies.splice(index, 1);
    }
  }
}

  /**
   * Patrols the area by moving left or right.
   */
  startPatrol(leftLimit, rightLimit) {
    if (this.patrolling) return;
    this.patrolling = true;
    this.setCustomInterval(() => {
      if (this.x <= leftLimit) this.otherDirection = false;
      if (this.x >= rightLimit) this.otherDirection = true;
      this.x += this.otherDirection ? -this.speed : this.speed;
    }, 50);
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
   * Checks if the character is in attack range.
   * @param {Character} character - The character to check.
   * @returns {boolean} True if the character is in attack range, false otherwise.
   */
  isInAttackRange(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
  }

  /**
   * Attacks the character if in range.
   * @param {Character} character - The character to attack.
   */
  attack(character) {
    if (this.dead || this.isAttacking) return;
    if (!(character.x < this.x && this.otherDirection)) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACK, 80);
    setTimeout(() => {
      if (this.isInAttackRange(character)) {
        character.takeDamage(this.attackDamage);
      }
    }, 150);
    setTimeout(() => {
      this.isAttacking = false;
    }, 500);
  }
  /**
   * Checks if the enemy is hurt.
   * @returns {boolean} True if the enemy is hurt, false otherwise.
   */
  takeDamage(damage) {
    if (this.dead) return;
    this.energy = Math.max(0, this.energy - damage);
    playEnemyHitSound();
    if (this.energy <= 0) {
      this.die();
    } else {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

 die() {
  if (this.dead) return;
  this.dead = true;
  this.stopAllIntervals();
  playSnakeDyingSound();
  if (this.IMAGES_DEAD?.length) {
    this.playAnimation(this.IMAGES_DEAD, 150, false, () => {
      this.isVisible = false;
    });
  } else {
    this.isVisible = false;
  }
}

  /**
   * Starts the animation of the enemy.
   */
  startStandardAnimation() {
    this.setCustomInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD, 200, false);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK, 100);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT, 100);
      } else {
        this.playAnimation(this.IMAGES_WALK, 150);
      }
    }, 100);
  }
  /**
   * Updates the enemy's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (this.dead) return;
    if (this.isInAttackRange(character)) {
      this.attack(character);
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
   * Makes the enemy take damage.
   */
  isColliding(mo) {
    if (!(mo instanceof DrawableObject)) return false;
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Adds intervals so they can be stopped later.
   * @param {Function} fn - The function to execute.
   * @param {number} interval - The interval time in milliseconds.
   */
  setCustomInterval(fn, interval) {
    const id = setInterval(fn, interval);
    this.animationIntervals.push(id);
  }

  /**
   * Stops all set intervals.
   */
  stopAllIntervals() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }

  getAttackBox() {
    const box = this.getCollisionBox();
    const range = this.attackRange * 0.8;
    return {
      x: this.otherDirection ? box.x - range : box.x + box.width,
      y: box.y,
      width: range,
      height: box.height,
    };
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
