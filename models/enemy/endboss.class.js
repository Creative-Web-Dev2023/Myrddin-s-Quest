/**
 * Represents the Endboss enemy (Troll) in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  innerOffset = { top: 250, bottom: 90, left: 450, right: 500 };
  outerOffset = { top: 250, bottom: 90, left: 250, right: 380 };

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
    this.height = 700;
    this.width = 1120;
    this.y = -120;
    this.x = 5500;
    this.speed = 2;
    this.healthBar;
    this.isDeadAlready = false;
    this.patrolMin = 5000;
    this.patrolMax = 5800;
    this.nextTurnPoint = this.getRandomTurnPoint("left");
    this.isTriggered = false;
    this.isAttacking = false;
  }

  /**
   * Updates the endboss state, animation, and movement.
   */
  update() {
    if (this.isDeadAlready) return;
    this.handleAnimations();
    if (this.isTriggered) {
      this.chasePlayer();
    } else {
      this.patrol();
    }
    this.healthBar.setPercentage(this.energy);
  }

  /**
   * Handles the endboss animation.
   */
  handleAnimations() {
    if (this.isAttacking) return;
    this.animate(LOADED_IMAGES.troll.walk);
    this.getTriggerZone();
  }

  /**
   * Returns the trigger zone rectangle for the endboss.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getTriggerZone() {
    return {
      x: this.x - 80,
      y: this.y + 100,
      width: 300,
      height: this.height * 0.8,
    };
  }

  /**
   * Returns a random turn point for patrol movement.
   * @param {'left'|'right'} direction
   * @returns {number}
   */
  getRandomTurnPoint(direction) {
    if (direction === "right") {
      return this.patrolMax - Math.random() * 150;
    } else {
      return this.patrolMin + Math.random() * 200;
    }
  }

  /**
   * Handles patrol movement of the endboss.
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
   * Handles chasing the player when triggered.
   */
  chasePlayer() {
    this.otherDirection = false;
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.playAnimationOnce(LOADED_IMAGES.troll.attack, () => {
        this.isAttacking = false;
      });
    }
    this.moveLeft();
  }

  /**
   * Plays the death animation and sound for the endboss.
   */
  die() {
    if (this.isDeadAlready || !this.isDead()) return;
    this.playDeathAnimation( LOADED_IMAGES.troll.die, LOADED_SOUNDS.troll.die, null 

    );
  }

  /**
   * Checks if the endboss is hit by another object.
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
