/**
 * Represents the endboss (troll) enemy in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * The inner hitbox offset for the endboss.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  innerOffset = { top: 10, bottom: 100, left: 250, right: 180 };

  /**
   * The outer hitbox offset for the endboss.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  outerOffset = { top: 10, bottom: 100, left: 40, right: 50 };

  /**
   * The health bar for the endboss.
   * @type {StatusBar}
   */
  healthBar;

  /**
   * Indicates if the death animation has already been played.
   * @type {boolean}
   */
  isDeadAlready = false;

  /**
   * Indicates if the endboss is currently dead (animation played).
   * @type {boolean}
   */
  deadAnimationPlayed = false;

  /**
   * The minimum X position for patrol.
   * @type {number}
   */
  patrolMin = 5000;

  /**
   * The maximum X position for patrol.
   * @type {number}
   */
  patrolMax = 5800;

  /**
   * The next X position where the endboss will turn around.
   * @type {number}
   */
  nextTurnPoint;

  /**
   * Creates a new Endboss instance.
   */
  constructor() {
    super();
    this.addToImageCache("walk", LOADED_IMAGES.troll.walk);
    this.addToImageCache("hurt", LOADED_IMAGES.troll.hurt);
    this.addToImageCache("dead", LOADED_IMAGES.troll.die);
    this.img = this.imageCache["walk_0"];
    this.deadAnimationPlayed = false;
    this.height = 409;
    this.width = 700;
    this.y = 100;
    this.x = 5500;
    this.speed = 2;
    this.energy = 100;
    this.healthBar;
    this.isDeadAlready = false;
    this.patrolMin = 5000;
    this.patrolMax = 5800;
    this.nextTurnPoint = this.getRandomTurnPoint("left");
  }

  /**
   * Updates the endboss's animation, patrol, and health bar.
   */
  update() {
    if (this.isDeadAlready) return;
    this.handleAnimations();
    this.patrol();
    this.healthBar.setPercentage(this.energy);
  }

  /**
   * Handles the endboss's walking animation.
   */
  handleAnimations() {
    this.animate(LOADED_IMAGES.troll.walk);
  }

  /**
   * Returns a random X position for the next patrol turn point.
   * @param {'left'|'right'} direction - The patrol direction.
   * @returns {number} The X position for the next turn.
   */
  getRandomTurnPoint(direction) {
    if (direction === "right") {
      return this.patrolMax - Math.random() * 150;
    } else {
      return this.patrolMin + Math.random() * 200;
    }
  }

  /**
   * Moves the endboss left and right between patrol points.
   */
  patrol() {
    if (this.isDead()) return;
    if (!this.otherDirection) {
      this.moveLeft();
      if (this.x <= this.nextTurnPoint) {
        this.otherDirection = true;
        this.nextTurnPoint = this.getRandomTurnPoint("right");
      }
    } else {
      this.moveRight();
      if (this.x >= this.nextTurnPoint) {
        this.otherDirection = false;
        this.nextTurnPoint = this.getRandomTurnPoint("left");
      }
    }
  }

  /**
   * Triggers the death animation and sound for the endboss.
   */
  die() {
    if (this.isDeadAlready || !this.isDead()) return;
    this.playDeathAnimation(
      LOADED_IMAGES.troll.die,
      LOADED_SOUNDS.troll.die,
      null
    );
  }

  /**
   * Checks if the endboss is hit by another object.
   * @param {MovableObject} otherObject - The object to check collision with.
   * @param {Object} [otherOffset=null] - The hitbox offset for the other object.
   * @param {Object} [myOffset=this.outerOffset] - The hitbox offset for the endboss.
   * @returns {boolean} True if hit, otherwise false.
   */
  isHitBy(otherObject, otherOffset = null, myOffset = this.outerOffset) {
    const a = otherObject.getHitbox(otherOffset);
    const b = this.getHitbox(myOffset);
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }
}
