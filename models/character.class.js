let isAfterDoor = false;
let hasPassedDoor = false;
/**
 * Class representing the character.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 290;
  width = 520;
  speed = 4;
  invulnerable = false;
  poisonCollected = 0;
  deadAnimationPlayed = false;
  hasKey = false;
  isVisible = true;
  attackDamage = 10;
  animationIntervals = [];
  offset = { top: 60, bottom: 10, left: 215, right: 200 };

  /**
   * Creates an instance of Character.
   */
  constructor(world, poisonStatusBar) {
    super();
    this.loadImage(LOADED_IMAGES.character.idle[0]);
    this.addToImageCache("idle", LOADED_IMAGES.character.idle);
    this.addToImageCache("walk", LOADED_IMAGES.character.walk);
    this.addToImageCache("jump", LOADED_IMAGES.character.jump);
    this.addToImageCache("attack", LOADED_IMAGES.character.attack);
    this.addToImageCache("die", LOADED_IMAGES.character.die);
    this.addToImageCache("hurt", LOADED_IMAGES.character.hurt);
    this.world = world;
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar();
    this.initCharacter();
    this.canMoveLeftFlag = true;
  }

  /**
   * Initializes the character.
   */
  initCharacter() {
    this.applyGravity();
    this.energy = 100;
    // this.x =4000;
    this.x = 90; 
    this.y = 150; 
    this.poisonStatusBar.setPercentage(0);
    this.healthBar = new StatusBar();
    this.world.characterStatusBar = this.healthBar;
    this.world.camera_x = -this.x - 190;
    this.canMoveLeftFlag = true;
    this.img = this.imageCache["idle_0"];
    this.drawFrame();
    this.animate();
  }

  /**
   * Updates the character's state.
   */
  update() {
    if (!this.isVisible || this.energy <= 0) return;
    if (this.energy <= 0 && !this.deadAnimationPlayed) {
      this.die();
    }
    this.handleMovement();
    this.handleActions();
    this.updateCamera();
  }

  /**
   * Handles the character's movement.
   */
  handleMovement() {
    const isMovingRight =
      this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x + 200;
    const isMovingLeft =
      this.world.keyboard.LEFT && this.x > 0 && this.canMoveLeft();
    if (isMovingRight) {
      this.moveRight();
      this.otherDirection = false;
    }
    if (isMovingLeft) {
      this.moveLeft();
      this.otherDirection = true;
    }
    if (isMovingRight || isMovingLeft) {
      playWalkingSound();
    } else {
      stopWalkingSound();
    }
    if (this.world.keyboard.JUMP && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Handles the character's actions.
   */
  handleActions() {
    if (this.world.keyboard.ATTACK && !this.isAttacking) {
      this.isAttacking = true;
      this.currentAttackFrame = 0;
      playAttackSound();
      this.playAttackAnimation(() => {
        this.isAttacking = false;
      });
      this.attackEnemies();
    }
  }
  /**
   * Plays the attack animation.
   * @param {Function} callback - Optional callback function to execute after the animation ends.
   */
  playAttackAnimation(callback) {
    let attackIndex = 0;
    playAttackSound();
    const attackInterval = setInterval(() => {
      if (attackIndex < LOADED_IMAGES.character.attack.length) {
        this.img = this.imageCache[LOADED_IMAGES.character.attack[attackIndex]];
        attackIndex++;
      } else {
        clearInterval(attackInterval);
        if (callback) callback();
      }
    }, 150);
  }

  /**
   * Attacks enemies within range.
   */
  attackEnemies() {
    this.world.enemies.forEach((enemy) => {
      if (
        enemy instanceof Knight ||
        enemy instanceof Snake ||
        enemy instanceof Endboss
      ) {
        if (!enemy.dead) {
          const distance = Math.abs(this.x - enemy.x);
          if (distance < 150) {
            enemy.takeDamage(10);
            if (enemy instanceof Endboss) {
              enemy.statusBarEndboss.setPercentage(enemy.energy);
              if (enemy.energy <= 0) {
                enemy.die();
              }
            }
          }
        }
      }
    });
  }

  /**
   * Makes the character jump.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 33;
      playJumpSound();
    }
  }

  /**
   * Updates the camera position.
   */
  updateCamera() {
    this.world.camera_x = -this.x - 190;
  }

  /**
   * Makes the character take damage.
   */
  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
      this.energy -= damage;
      this.lastHit = Date.now();
      this.world.characterStatusBar.setPercentage(this.energy);
      this.playAnimation(LOADED_IMAGES.character.hurt);
      if (this.energy <= 0) {
        this.die();
      } else {
        this.invulnerable = true;
        setTimeout(() => (this.invulnerable = false), 1000);
      }
    }
  }

  /**
   * Handles the character's death.
   */
  die() {
    if (!this.deadAnimationPlayed) {
      this.saveLastPosition();
      this.deadAnimationPlayed = true;
      this.isVisible = true;
      this.playDeathAnimation(() => {
        this.isVisible = false;
        this.world.endGame.showYouLostScreen();
      });
    }
  }

  /**
   * Plays the death animation.
   */
  playDeathAnimation(callback) {
    let deathIndex = 0;
    const deathInterval = setInterval(() => {
      if (deathIndex < LOADED_IMAGES.character.die.length) {
        this.img = this.imageCache[LOADED_IMAGES.character.die[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        if (callback) callback();
      }
    }, 150);
  }

  /**
   * Animates the character.
   */
  animate() {
    this.stopAllAnimations();
    let interval = setInterval(() => {
      if (this.isDead() && !this.deadAnimationPlayed) {
        this.die();
      } else if (this.isHurt() && this.energy >= 1) {
        this.playAnimation(LOADED_IMAGES.character.hurt);
      } else if (this.isAttacking) {
        this.playAnimation(LOADED_IMAGES.character.attack);
      } else if (this.isAboveGround()) {
        this.playAnimation(LOADED_IMAGES.character.jump);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(LOADED_IMAGES.character.walk);
      } else if (this.energy >= 1) {
        this.playAnimation(LOADED_IMAGES.character.idle);
      }
    }, 100);
    this.animationIntervals.push(interval);
  }

  /**
   * Stops all animations.
   */
  stopAllAnimations() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }

  /**
   * Resets the character's state.
   */
  reset() {
    this.speed = 4;
    this.stopAllAnimations();
    Object.assign(this, {
      // x: 5000,
      y: 150,
      isVisible: true,
      energy: 100,
      deadAnimationPlayed: false,
      isAttacking: false,
      invulnerable: false,
      currentImage: 0,
      speedY: 0,
      acceleration: 2.5,
    });
    this.poisonCollected = 5;
    this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    this.playAnimation(LOADED_IMAGES.character.idle);
    this.animate();
    this.stopGravity();
    this.applyGravity();
  }

  /**
   * Resets the positions of all enemies.
   */
  resetEnemies() {
    this.world.enemies.forEach((enemy) => enemy.resetPosition?.());
  }

  /**
   * Handles the character entering a door.
   */
  enterDoor(door) {
    if (hasPassedDoor) return;
    this.isVisible = false;
    this.x = door.x;
    this.y = door.y;
    setTimeout(() => {
      this.isVisible = false;
      setTimeout(() => {
        this.x = 6471;
        this.y = 150;
        this.world.camera_x = -this.x - 190;
        this.isVisible = true;
        isAfterDoor = true;
        hasPassedDoor = true;
        this.world.snakes = this.world.level.snakes || [];
        console.log("🐍 Snakes nach Türdurchgang:", this.world.snakes);
        setTimeout(() => {
          isAfterDoor = false;
        }, 2000);
        playNewSound();
      }, 200);
    }, 2000);
  }

  /**
   * Checks if the character can move left.
   */
  canMoveLeft() {
    if (hasPassedDoor && this.x < 6471) return false;
    return this.canMoveLeftFlag && !isAfterDoor;
  }

  /**
   * Checks if the character is moving.
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Collects a poison bottle.
   */
  collectPoison(poison, index) {
    if (poison && poison.isActive) {
      poison.deactivate();
      this.poisonCollected += 1;
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
      this.world.poisonsArray.splice(index, 1);
      playCollectPoisonBottleSound();
    }
  }

  /**
   * Collects a key.
   */
  collectKey(key) {
    if (key && key.isActive) {
      key.deactivate();
      this.hasKey = true;
    }
  }

  /**
   * Handles the character hitting an enemy.
   */
  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);
    if (!this.invulnerable && distance < 100) {
      this.takeDamage(5);
      this.world.characterStatusBar.setPercentage(this.energy);
      this.playAnimation(LOADED_IMAGES.character.hurt);
    }
  }

  /**
   * Throws a poison bottle.
   */
  throwPoisonBottle() {
    if (this.poisonCollected === 0) {
      return;
    }
    this.poisonCollected--;
    this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    const offsetX = this.otherDirection ? -220 : 220;
    const poisonBottle = new ThrowableObject(this.x + offsetX, this.y + 50);
    poisonBottle.otherDirection = this.otherDirection;
    this.world.throwableObjects.push(poisonBottle);
  }

  /**
   * Resets the character's position to the last saved location or a default position.
   */
  resetPosition(position) {
    const resetPos = {
      x: (position?.x || this.lastPosition?.x || 90) - 100,
      y: position?.y || this.lastPosition?.y || 150,
    };
    this.x = resetPos.x < 0 ? 0 : resetPos.x;
    this.y = resetPos.y;
    this.energy = 100;
    this.isVisible = true;
    this.deadAnimationPlayed = false;
    this.invulnerable = false;
    this.playAnimation(LOADED_IMAGES.character.idle);
    this.stopGravity();
    this.applyGravity();
  }

  /**
   * Speichert die aktuelle Position des Charakters.
   */
  saveLastPosition() {
    this.lastPosition = { x: this.x, y: this.y };
  }

  drawFrame() {
    super.draw(ctx);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}
