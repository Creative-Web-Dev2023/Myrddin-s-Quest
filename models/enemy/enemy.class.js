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
    this.otherDirection = true; 
    this.patrolling = false;
    this.animationIntervals = [];
    this.isReadyToRemove = false; 
    this.isVisible = true;
  }

  /**
   * Sets the world for the enemy.
   * @param {Object} world - The world object.
   */
  setWorld(world) {
    this.world = world;
    if (this instanceof Snake) {
      if (!world.snakes.includes(this)) {
        world.snakes.push(this);
      }
    } else {
      if (!world.enemies.includes(this)) {
        world.enemies.push(this);
      }
    }
  }

  /**
   * Patrols the area by moving left or right.
   */
  startPatrol(leftLimit, rightLimit) {
    if (this.patrolling) return;
    this.patrolling = true;
    this.otherDirection = true; 
    
    this.setCustomInterval(() => {
      if (!this.dead && !this.isAttacking) {
        if (this.x <= leftLimit) {
          this.x = rightLimit; // Zurück zum Startpunkt
        } else {
          this.x -= this.speed; // Immer nach links bewegen
        }
      }
    }, 50);
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
    this.stopAllIntervals();
    if (this.world) {
      this.world.removeEnemyFromWorld(this);
    }
  }

  /**
   * Checks if the enemy is dead.
   * @returns {boolean} True if the enemy is dead, false otherwise.
   */
  isDead() {
    return this.energy <= 0;
  }

  isHurt() {
    return this.energy < 100 && !this.dead;
  }

  /**
   * Checks if the enemy is hurt.
   * @returns {boolean} True if the enemy is hurt, false otherwise.
   */
  takeDamage(damage) {
    if (this.dead) return;
    
    this.energy -= damage;
    this.isHurt = true;
    
    if (this.energy <= 0) {
      this.die();
    } else {
      this.playAnimation(this.IMAGES_HURT, 100, false, () => {
        this.isHurt = false;
      });
    }
  }

  /**
   * Handles the death of the enemy.
   */
  die() {
    if (this.dead) return;
    
    this.dead = true;
    this.stopAllIntervals();
    
    console.log(`Enemy ${this.id} started death animation`);
    
    this.playAnimation(this.IMAGES_DEAD, 200, false, () => {
      this.isReadyToRemove = true;
      this.isVisible = false;
      console.log(`Enemy ${this.id} death animation completed, ready to remove`);
      
      if (this.world) {
        this.world.removeEnemyFromWorld(this);
      }
    });
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
    this.animationIntervals.push(id); // Verwende animationIntervals
  }

  getAttackBox() {
    const box = this.getCollisionBox();
    return {
      x: this.otherDirection ? box.x - this.attackRange : box.x + box.width,
      y: box.y,
      width: this.attackRange,
      height: box.height,
    };
  }

  /**
   * Stops all set intervals.
   */
  stopAllIntervals() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
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

  this.startStandardAnimation(); 
}



  /**
   * Starts the standard animation of the enemy.
   */
  startStandardAnimation() {
    this.setCustomInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD, 200, false);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK, 100);
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT, 100);
      } else {
        this.playAnimation(this.IMAGES_WALK, 150);
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

  draw(ctx) {
    if (!this.isVisible) return;
    
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
