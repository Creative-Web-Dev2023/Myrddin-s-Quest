/**
 * Class representing a Snake enemy.
 * @extends Enemy
 */
class Snake extends Enemy {
  /**
   * Creates an instance of Snake.
   * @param {number} [startX=400] - The starting x position of the snake.
   * @param {number} [moveRange=100] - The range within which the snake can move.
   */
  constructor(startX = 400, moveRange = 100) {
    super();
    this.loadEnemyImages("snake");

    this.img = this.imageCache["walk_0"];
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 160;
    this.y = 320;
    this.energy = 10;
    this.dead = false;
    this.attackDamage = 10;
    this.attackRange = 30;
    this.speed = 0.5;
    this.otherDirection = true;
    this.initialX = startX;
    this.initialY = this.y;
    this.offset = { top: 80, bottom: 40, left: 50, right: 50 };

    this.IMAGES_WALK = LOADED_IMAGES.snake.walk;
    this.IMAGES_ATTACK = LOADED_IMAGES.snake.attack;
    this.IMAGES_HURT = LOADED_IMAGES.snake.hurt;
    this.IMAGES_DEAD = LOADED_IMAGES.snake.dead;

    this.patrolling = false;
    this.startMovement();
  }

  /**
   * Sets the world for the snake.
   * @param {Object} world - The world object.
   */
  setWorld(world) {
    this.world = world;
  }

  /**
   * Starts patrol and animation.
   */
  startMovement() {
    this.startPatrol(this.startX - this.moveRange, this.startX);
    this.startStandardAnimation();
  }

  /**
   * Overridden patrol method with protection against multiple intervals.
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
   * Updates the snake's behavior.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    if (this.dead) return;
    if (this.calculateAttackRange(character)) {
      this.attack(character);
    }
  }

  /**
   * Checks if the character is in attack range.
   */
  calculateAttackRange(character) {
    const snakeBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: this.otherDirection
        ? snakeBox.x - this.attackRange - 50
        : snakeBox.x + snakeBox.width + 30,
      y: snakeBox.y,
      width: this.attackRange - 40,
      height: snakeBox.height,
    };
    return (
      attackBox.x < characterBox.x + characterBox.width &&
      attackBox.x + attackBox.width > characterBox.x &&
      attackBox.y < characterBox.y + characterBox.height &&
      attackBox.y + attackBox.height > characterBox.y
    );
  }

  /**
   * Triggers the attack animation and applies damage.
   */
  attack(character) {
    if (this.dead || this.isAttacking) return;

    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACK, 150, false, "attack", () => {
      this.isAttacking = false;
    });

    setTimeout(() => {
      if (character && this.calculateAttackRange(character)) {
        character.takeDamage(this.attackDamage);
      }
    }, 500);
  }

  /**
   * Applies damage to the snake.
   */
  takeDamage(damage) {
    if (this.dead) return;
    this.energy -= damage;
    this.energy = Math.max(0, this.energy);
    if (this.energy > 0) {
      this.playAnimation(this.IMAGES_HURT);
    } else {
      this.die();
    }
  }

  /**
   * Handles snake's death.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    playSnakeDyingSound();
    if (this.IMAGES_DEAD && this.IMAGES_DEAD.length > 0) {
      this.playAnimation(this.IMAGES_DEAD, 150, false, "dead", () => {
        this.isVisible = false;
        super.removeEnemy();
      });
    } else {
      this.isVisible = false;
      super.removeEnemy();
    }
  }

  /**
   * Draws the snake and its collision/attack box.
   */
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

  /**
   * Resets snake position and state.
   */
  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.dead = false;
    this.isVisible = true;
  }
}
