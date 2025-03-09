let isAfterDoor = false;

class Character extends MovableObject {
  height = 290;
  width = 520;
  speed = 5;
  invulnerable = false;
  poisonCollected = 0;
  deadAnimationPlayed = false;
  hasKey = false;
  isVisible = true;
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

  constructor(world, poisonStatusBar) {
    super();
    this.world = world;
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar();
    this.initCharacter();
  }

  /**
   * 🔹 Initialisiert den Charakter
   */
  initCharacter() {
    this.loadImage(this.IMAGES.IDLE[0]);
    this.loadAllImages();
    this.applyGravity();
    this.energy = 100;
    this.poisonStatusBar.setPercentage(0);
    this.statusBar = new StatusBar();
    this.world.camera_x = -this.x - 190;
    this.canMoveLeft = true;
    this.animate();
  }

  /**
   * 🔹 Lädt alle Bilder in den Cache
   */
  loadAllImages() {
    Object.values(this.IMAGES).forEach((imgArray) => this.loadImages(imgArray));
  }

  /**
   * 🔹 Lädt Bildarrays automatisch
   */
  loadImageArray(path, count) {
    let images = [];
    for (let i = 0; i < count; i++) {
      let index = i.toString().padStart(3, "0");
      images.push(`${path}${index}.png`);
    }
    return images;
  }

  update() {
    if (!this.isVisible || this.energy <= 0) return;
    this.handleMovement();
    this.handleActions();
    this.updateCamera();
  }

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

  handleActions() {
    this.isAttacking = this.world.keyboard.ATTACK;
    if (this.isAttacking) {
      this.playAnimation(this.IMAGES.ATTACK);
      this.attackEnemies();
    }
  }

  attackEnemies() {
    this.world.enemies.forEach((enemy) => {
      if (
        (enemy instanceof Knight ||
          enemy instanceof Snake ||
          enemy instanceof Endboss) &&
        !enemy.dead
      ) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance < 150) {
          enemy.takeDamage(10);
        }
      }
    });
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 33;
      playJumpSound();
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x - 190;
  }

  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
      this.energy -= damage;
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

  die() {
    if (!this.deadAnimationPlayed) {
      this.deadAnimationPlayed = true;
      this.playDeathAnimation();
      this.scheduleGameOver();
    }
  }

  playDeathAnimation() {
    this.stopAllAnimations();
    let deathIndex = 0;

    let deathInterval = setInterval(() => {
      if (deathIndex < this.IMAGES.DEAD.length) {
        this.img = this.imageCache[this.IMAGES.DEAD[deathIndex]];
        deathIndex++;
      } else {
        clearInterval(deathInterval);
        this.isVisible = false;
        this.world.endGame?.showYouLostScreen();
      }
    }, 150);
    this.animationIntervals.push(deathInterval);
  }

  scheduleGameOver() {
    setTimeout(() => {
      this.isVisible = false;
      this.world.endGame?.showYouLostScreen();
    }, this.IMAGES.DEAD.length * 150 + 500);
  }

  animate() {
    this.stopAllAnimations();
    let interval = setInterval(() => {
      if (this.isDead() && !this.deadAnimationPlayed) {
        this.playDeathAnimation();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES.HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES.ATTACK);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES.JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES.WALKING);
      } else {
        this.playAnimation(this.IMAGES.IDLE);
      }
    }, 100);
    this.animationIntervals.push(interval);
  }

  stopAllAnimations() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
  }

  reset() {
    this.stopAllAnimations();
    Object.assign(this, {
      x: 130,
      y: 150,
      isVisible: true,
      energy: 100,
      poisonCollected: 0,
      deadAnimationPlayed: false,
      isAttacking: false,
      invulnerable: false,
      currentImage: 0,
    });

    this.poisonStatusBar.setPercentage(0);
    this.playAnimation(this.IMAGES.IDLE);
    this.animate();
    this.applyGravity();
  }

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
        isAfterDoor = true; // Setze isAfterDoor auf true, nachdem der Charakter durch die Tür gegangen ist
        playNewSound();
      }, 200);
    }, 2000);
  }

  canMoveLeft() {
    return !isAfterDoor; // Verhindere das Bewegen nach links, wenn der Charakter durch die Tür gegangen ist
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  collectPoison(poison, index) {
    if (poison && poison.isActive) {
      poison.deactivate();
      this.poisonCollected += 1;
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
      this.world.poisonsArray.splice(index, 1);
      playCollectPoisonBottleSound();
    }
  }

  collectKey(key) {
    if (key && key.isActive) {
      key.deactivate();
      this.hasKey = true;
    }
  }

  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);
    if (!this.invulnerable && distance < 100) {
      this.takeDamage(5);
      this.world.characterStatusBar.setPercentage(this.energy);
      this.playAnimation(this.IMAGES.HURT);
    }
  }

  throwPoisonBottle() {
    if (this.poisonCollected > 0) {
      const poisonBottle = new ThrowableObject(this.x, this.y);
      this.world.throwableObjects.push(poisonBottle);
      this.poisonCollected--;
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    } else {
      alert("Keine Giftflaschen verfügbar! Kämpfe weiter mit Angriffen.");
    }
  }
}
