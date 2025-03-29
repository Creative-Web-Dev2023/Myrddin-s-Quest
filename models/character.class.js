let isAfterDoor = false;

/**
 * Class representing the character.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 290;
  width = 520;
  speed = 5;
  invulnerable = false;
  poisonCollected = 0;
  deadAnimationPlayed = false;
  hasKey = false;
  isVisible = true;
  attackDamage = 10; // Angriffsschaden des Charakters
  animationIntervals = [];
  offset = { top: 50, bottom: 10, left: 210, right: 200 };
  IMAGES = {
    IDLE: this.loadImageArray("img/wizard/idle/idle_", 10),
    WALKING: this.loadImageArray("img/wizard/walk/walk_", 9),
    JUMPING: this.loadImageArray("img/wizard/jump/jump_", 9),
    ATTACK: this.loadImageArray("img/wizard/attack/Attack_", 7),
    DEAD: this.loadImageArray("img/wizard/die/die_", 9),
    HURT: this.loadImageArray("img/wizard/hurt/hurt_", 9),
    YOU_LOST: ["img/game_ui/login&pass/game_over.png"],
  };

  /**
   * Creates an instance of Character.
   * @param {Object} world - The world object.
   * @param {Object} poisonStatusBar - The poison status bar object.
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
   * @param {string} path - The path to the images.
   * @param {number} count - The number of images.
   * @returns {Array} The array of image paths.
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
      console.log("Charakter stirbt, rufe die() auf."); // Debugging-Log
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
    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.level_end_x + 200
    ) {
      this.moveRight();
      this.otherDirection = false;
      playWalkingSound();
    }
    if (this.world.keyboard.LEFT && this.x > 0 && this.canMoveLeft()) {
      this.moveLeft();
      this.otherDirection = true;
      playWalkingSound();
    }
    if (this.world.keyboard.JUMP && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Handles the character's actions.
   */
  handleActions() {
    this.isAttacking = this.world.keyboard.ATTACK;
    if (this.isAttacking) {
      this.playAnimation(this.IMAGES.ATTACK);
      this.attackEnemies();
    }
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
   * @param {number} damage - The amount of damage to take.
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
      this.playDeathAnimation();
      setTimeout(() => {
        this.isVisible = false;
        this.world.endGame.showYouLostScreen();
      }, this.IMAGES.DEAD.length * 150);
    }
  }

  /**
   * Plays the death animation.
   */
  playDeathAnimation() {
    if (this.deadAnimationPlayed) return;
    this.deadAnimationPlayed = true;
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES.DEAD[0]];
    this.animateDeath();
  }

  /**
   * Animates the death of the character.
   */
  animateDeath() {
    let deathIndex = 0;
    const deathInterval = setInterval(() => {
      if (deathIndex < this.IMAGES.DEAD.length) {
        this.img = this.imageCache[this.IMAGES.DEAD[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        setTimeout(() => {
          this.isVisible = false;
          this.scheduleGameOver();
        }, 1000);
      }
    }, 150);
  }

  /**
   * Schedules the game over screen.
   */
  scheduleGameOver() {
    setTimeout(() => {
      this.isVisible = false;
      this.world.endGame?.showYouLostScreen();
    }, this.IMAGES.DEAD.length * 150 + 1000);
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
    this.stopAllAnimations();
    Object.assign(this, {
      x: 130,
      y: 150,
      isVisible: true,
      energy: 100,
      deadAnimationPlayed: false,
      isAttacking: false,
      invulnerable: false,
      currentImage: 0,
    });
    this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    this.playAnimation(this.IMAGES.IDLE);
    this.animate();
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
   * @param {Object} door - The door the character is entering.
   */
  enterDoor(door) {
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
        this.canMoveLeftFlag = false;
        setTimeout(() => {
          this.canMoveLeftFlag = true;
        }, 2000);
        playNewSound();
      }, 200);
    }, 2000);
  }

  /**
   * Checks if the character can move left.
   * @returns {boolean} True if the character can move left, false otherwise.
   */
  canMoveLeft() {
    return this.canMoveLeftFlag;
  }

  /**
   * Checks if the character is moving.
   * @returns {boolean} True if the character is moving, false otherwise.
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Collects a poison bottle.
   * @param {Object} poison - The poison object.
   * @param {number} index - The index of the poison in the array.
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
   * @param {Object} key - The key object.
   */
  collectKey(key) {
    if (key && key.isActive) {
      key.deactivate();
      this.hasKey = true;
    }
  }

  /**
   * Handles the character hitting an enemy.
   * @param {Object} enemy - The enemy object.
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
    if (this.poisonCollected > 0) {
      const poisonBottle = new ThrowableObject(this.x, this.y);
      this.world.throwableObjects.push(poisonBottle);
      this.poisonCollected--;
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    } else {
      alert("No poison bottle available,you can attack the Endboss!");
    }
  }


  /**
   * Resets the character's position to the last saved location or a default position.
   * @param {Object} [position] - Optional: The position object with x and y coordinates.
   */
  resetPosition(position) {
    const resetPos = position || this.lastPosition || { x: 130, y: 150 };
    this.x = resetPos.x;
    this.y = resetPos.y;
    this.energy = 100;
    this.isVisible = true;
    this.deadAnimationPlayed = false; 
    this.invulnerable = false;
    this.playAnimation(this.IMAGES.IDLE);
    this.applyGravity();
  }

  /**
   * Speichert die aktuelle Position des Charakters.
   */
  saveLastPosition() {
    this.lastPosition = { x: this.x, y: this.y };
  }
}
