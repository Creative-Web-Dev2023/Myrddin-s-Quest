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
  offset = { top: 50, bottom: 10, left: 160, right: 200 };
  IMAGES = {
    IDLE: this.loadImageArray("img/wizard/idle/idle_", 10),
    WALKING: this.loadImageArray("img/wizard/walk/walk_", 9),
    JUMPING: this.loadImageArray("img/wizard/jump/jump_", 9),
    ATTACK: this.loadImageArray("img/wizard/attack/attack_", 7),
    DEAD: this.loadImageArray("img/wizard/die/die_", 9),
    HURT: this.loadImageArray("img/wizard/hurt/hurt_", 9),
    YOU_LOST: ["img/game_ui/login&pass/game_over.png"],
  };

  /**
   * Creates an instance of Character.
   */
  constructor(world, poisonStatusBar) {
    super();
    this.world = world;
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar();
    this.initCharacter();
    this.canMoveLeftFlag = true;
  }

  /**
   * Initializes the character.
   */
  initCharacter() {
    this.loadImage(this.IMAGES.IDLE[0]);
    this.loadAllImages();
    this.applyGravity();
    this.energy = 100;
    this.poisonStatusBar.setPercentage(0);
    this.statusBar = new StatusBar();
    this.world.camera_x = -this.x - 190;
    this.canMoveLeftFlag = true;
    this.animate();
  }

  /**
   * Loads all images into the cache.
   */
  loadAllImages() {
    Object.values(this.IMAGES).forEach((imgArray) => this.loadImages(imgArray));
  }

  /**
   * Loads image arrays automatically.
   */
  loadImageArray(path, count) {
    let images = [];
    for (let i = 0; i < count; i++) {
      let number = i.toString().padStart(3, "0");
      images.push(`${path}${number}.png`);
    }
    return images;
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
      if (attackIndex < this.IMAGES.ATTACK.length) {
        this.img = this.imageCache[this.IMAGES.ATTACK[attackIndex]];
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
      this.playAnimation(this.IMAGES.HURT);
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
      if (deathIndex < this.IMAGES.DEAD.length) {
        this.img = this.imageCache[this.IMAGES.DEAD[deathIndex]];
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
        this.playAnimation(this.IMAGES.HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES.ATTACK);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES.JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES.WALKING);
      } else if (this.energy >= 1) {
        this.playAnimation(this.IMAGES.IDLE);
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
      x: 90, 
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
    this.playAnimation(this.IMAGES.IDLE);
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
      this.playAnimation(this.IMAGES.HURT);
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
    this.playAnimation(this.IMAGES.IDLE);
    this.stopGravity();
    this.applyGravity();
  }

  /**
   * Speichert die aktuelle Position des Charakters.
   */
  saveLastPosition() {
    this.lastPosition = { x: this.x, y: this.y };
  }
}
