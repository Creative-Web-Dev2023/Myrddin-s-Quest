/**
 * Class representing a Snake enemy.
 * @extends Enemy
 */
class Snake extends Enemy {
  
  /**
   * Creates an instance of Snake.
   * @param {number} [startX=400] - The starting x position of the snake.
   * @param {number} [moveRange=100] - The range within which the snake can move.
   * @param {number} [id] - The ID of the snake.
   */
  constructor(startX = 400, moveRange = 100) {
    super();
    this.loadEnemyImages("snake"); // Lade die Bilder für den Snake-Feind
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
    this.offset = { top: 80, bottom: 40, left: 50, right: 50 }; // Kollisionsbox verkleinert
    this.intervalIDs = [];
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
   * Checks if the character is in attack range and attacks if possible.
   * @param {Character} character - The character to check.
   */
  checkForAttack(character) {
    const isInAttackRange = this.calculateAttackRange(character);
    if (isInAttackRange && !this.isAttacking) {
      this.attack(character);
    }
  }

  /**
   * Calculates if the character is in attack range.
   * @param {Character} character - The character to check.
   * @returns {boolean} True if the character is in attack range, false otherwise.
   */
  calculateAttackRange(character) {
    const snakeBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: this.otherDirection
        ? snakeBox.x - this.attackRange - 50 // Angriffsdistanz nach links weiter verkleinert
        : snakeBox.x + snakeBox.width + 30, // Angriffsdistanz nach rechts bleibt gleich
      y: snakeBox.y,
      width: this.attackRange - 40, // Breite der Angriffsbox weiter reduziert
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
   * Patrols the area by moving left or right.
   */
  startMovement() {
    this.startPatrol(this.startX - this.moveRange, this.startX);
  }

  /**
   * Updates the snake's state.
   * @param {Character} character - The character to interact with.
   */
  update(character) {
    this.checkForAttack(character);
  }

  /**
   * Makes the snake take damage.
   * @param {number} damage - The amount of damage to take.
   */
  takeDamage(damage) {
    if (this.dead) return;
    this.energy -= damage;
    this.energy = Math.max(0, this.energy);
    if (this.energy > 0) {
      this.playAnimation(LOADED_IMAGES.snake.hurt);
    } else {
      this.die();
    }
  }

  /**
   * Handles the snake's death.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    playSnakeDyingSound();
    this.playAnimation(LOADED_IMAGES.snake.dead);
    setTimeout(() => {
      this.isVisible = false;
      super.removeEnemy();
    }, 1500);
  }
  /**
   * Draws the snake on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
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

    // Zeichne die Kollisionsbox
    const collisionBox = this.getCollisionBox();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      collisionBox.x,
      collisionBox.y,
      collisionBox.width,
      collisionBox.height
    );

    // Zeichne die Angriffsbox
    const attackBox = this.getAttackBox(collisionBox);
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.strokeRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
  }

  /**
   * Stops all animations.
   */
  stopAllAnimations() {
    this.intervalIDs.forEach(clearInterval);
    this.intervalIDs = [];
  }

  /**
   * Resets the position of the snake.
   */
  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.dead = false;
    this.isVisible = true;
  }

  /**
   * Gets the attack box of the snake.
   * @param {Object} snakeBox - The collision box of the snake.
   * @returns {Object} The attack box of the snake.
   */
  

  /**
   * Attacks the character if in range.
   * @param {Character} character - The character to attack.
   */
  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(LOADED_IMAGES.snake.attack);
    playSnakeAttackSound();
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
}
