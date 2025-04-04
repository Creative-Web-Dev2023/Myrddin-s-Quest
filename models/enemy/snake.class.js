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
  constructor(startX = 400, moveRange = 100, id) {
    super(id);
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 150;
    this.y = 320;
    this.energy = 10;
    this.dead = false;
    this.attackDamage = 10;
    this.attackRange = 50;
    this.speed = 0.5;
    this.otherDirection = true;
    this.initialX = startX;
    this.initialY = this.y;
    this.offset = { top: 60, bottom: 60, left: 50, right: 50 };
    this.IMAGES_WALKING = [
      "img/snake/walk/walk0.png",
      "img/snake/walk/walk1.png",
      "img/snake/walk/walk2.png",
      "img/snake/walk/walk3.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/snake/attack/attack0.png",
      "img/snake/attack/attack1.png",
      "img/snake/attack/attack2.png",
      "img/snake/attack/attack3.png",
    ];
    this.IMAGES_HURT = ["img/snake/hurt/hurt0.png", "img/snake/hurt/hurt1.png"];
    this.IMAGES_DEAD = [
      "img/snake/die/die0.png",
      "img/snake/die/die1.png",
      "img/snake/die/die2.png",
      "img/snake/die/die3.png",
    ];

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.intervalIDs = [];
    this.startMovement();
    this.startAnimation();
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
        ? snakeBox.x - this.attackRange
        : snakeBox.x + snakeBox.width,
      y: snakeBox.y,
      width: this.attackRange * 2,
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
  patrol() {
    if (this.dead) return;
    if (this.x <= this.startX - this.moveRange) {
      this.otherDirection = false;
    } else if (this.x >= this.startX + this.moveRange) {
      this.otherDirection = true;
    }
    this.x += this.otherDirection ? -this.speed : this.speed;
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
      this.playAnimation(this.IMAGES_HURT);
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
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => this.remove(), 1000);
  }

  /**
   * Removes the snake from the world.
   */
  remove() {
    this.removeEnemy();
  }

  /**
   * Loads images into the cache.
   * @param {Array} imageArray - The array of image paths.
   */
  loadImages(imageArray) {
    imageArray.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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
  }

  /**
   * Animates the snake.
   */
  animate() {
    setInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
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
  getAttackBox(snakeBox) {
    return {
      x: this.otherDirection
        ? snakeBox.x - this.attackRange
        : snakeBox.x + snakeBox.width,
      y: snakeBox.y,
      width: this.attackRange,
      height: snakeBox.height,
    };
  }

  /**
   * Attacks the character if in range.
   * @param {Character} character - The character to attack.
   */
  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
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
