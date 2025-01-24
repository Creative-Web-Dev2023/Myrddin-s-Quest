let isAfterDoor = false; 

class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 210;
  speed = 5;
  invulnerable = false;
  poisonCollected = 0;
  poisonStatusBar;
  deadAnimationPlayed = false;
  hasKey = false;
  isVisible = true;
  throwCooldown = false; // Abklingzeit-Flag
  offset = {
    top: 50,
    bottom: 10,
    left: 210,
    right: 200,
  };

  IMAGES_IDLE = [
    "img/wizard/idle/idle_000.png",
    "img/wizard/idle/idle_001.png",
    "img/wizard/idle/idle_002.png",
    "img/wizard/idle/idle_003.png",
    "img/wizard/idle/idle_004.png",
    "img/wizard/idle/idle_005.png",
    "img/wizard/idle/idle_006.png",
    "img/wizard/idle/idle_007.png",
    "img/wizard/idle/idle_008.png",
    "img/wizard/idle/idle_009.png",
  ];

  IMAGES_WALKING = [
    "img/wizard/walk/walk_001.png",
    "img/wizard/walk/walk_002.png",
    "img/wizard/walk/walk_003.png",
    "img/wizard/walk/walk_004.png",
    "img/wizard/walk/walk_005.png",
    "img/wizard/walk/walk_006.png",
    "img/wizard/walk/walk_007.png",
    "img/wizard/walk/walk_008.png",
    "img/wizard/walk/walk_009.png",
  ];

  IMAGES_JUMPING = [
    "img/wizard/jump/jump_000.png",
    "img/wizard/jump/jump_001.png",
    "img/wizard/jump/jump_002.png",
    "img/wizard/jump/jump_003.png",
    "img/wizard/jump/jump_004.png",
    "img/wizard/jump/jump_005.png",
    "img/wizard/jump/jump_006.png",
    "img/wizard/jump/jump_007.png",
    "img/wizard/jump/jump_008.png",
    "img/wizard/jump/jump_009.png",
  ];
  IMAGES_ATTACK = [
    "img/wizard/attack/Attack1.png",
    "img/wizard/attack/Attack2.png",
    "img/wizard/attack/Attack3.png",
    "img/wizard/attack/Attack4.png",
    "img/wizard/attack/Attack5.png",
    "img/wizard/attack/Attack6.png",
    "img/wizard/attack/Attack7.png",
  ];
  IMAGES_DEAD = [
    "img/wizard/die/die_000.png",
    "img/wizard/die/die_001.png",
    "img/wizard/die/die_002.png",
    "img/wizard/die/die_003.png",
    "img/wizard/die/die_004.png",
    "img/wizard/die/die_005.png",
    "img/wizard/die/die_006.png",
    "img/wizard/die/die_007.png",
    "img/wizard/die/die_008.png",
    "img/wizard/die/die_009.png",
  ];

  IMAGES_HURT = [
    "img/wizard/hurt/hurt_000.png",
    "img/wizard/hurt/hurt_001.png",
    "img/wizard/hurt/hurt_002.png",
    "img/wizard/hurt/hurt_003.png",
    "img/wizard/hurt/hurt_004.png",
    "img/wizard/hurt/hurt_005.png",
    "img/wizard/hurt/hurt_006.png",
    "img/wizard/hurt/hurt_007.png",
    "img/wizard/hurt/hurt_008.png",
    "img/wizard/hurt/hurt_009.png",
  ];
  IMAGES_YOU_LOST = ["img/game_ui/login&pass/game_over.png"];
  world = {};
  constructor(world, poisonStatusBar) {
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.world = world || {};
    this.applyGravity();
    this.energy = 100;
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar();
    this.poisonStatusBar.setPercentage(0);
    this.statusBar = new StatusBar();
    this.loadImages(this.IMAGES_YOU_LOST);
    this.world.camera_x = -this.x - 190;
    this.canMoveLeft = true;
  }

  update() {
    if (!this.isVisible) return;
    if (this.energy > 0) {
      this.handleMovement();
      this.handleActions();
      this.updateCamera();
    }
  }

  handleMovement() {
    walkingSound.pause();
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x + 200) { // Erlaubt Bewegung ein wenig nach dem Endboss
      this.moveRight();
      this.otherDirection = false;
      playWalkingSound();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      playWalkingSound();
    }
    if (this.world.keyboard.JUMP && !this.isAboveGround()) {
      this.jump();
    }
  }

  moveLeft() {
    if (!this.canMoveLeft && this.x <= 6471) {
      return; 
    }
    this.x -= this.speed; 
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play(); 
    }
  }

  handleActions() {
    if (this.world.keyboard.ATTACK) {
      this.isAttacking = true;
      this.playAnimation(this.IMAGES_ATTACK);
      this.attackEnemies();
    } else {
      this.isAttacking = false;
    }
  }

  updateCamera() {
    this.world.camera_x = -this.x - 190;
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 33;
      playJumpSound();
    }
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);
    if (!this.invulnerable && distance < 100) {
      this.takeDamage(5);
      this.world.characterStatusBar.setPercentage(this.energy);
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
      this.energy -= damage;
      this.lastHit = new Date().getTime(); // Setze lastHit auf die aktuelle Zeit
      this.world.characterStatusBar.setPercentage(this.energy);
      this.playAnimation(this.IMAGES_HURT);
      this.updateStatusBar();

      if (this.energy <= 0) {
        this.energy = 0;
        this.die();
      } else {
        this.invulnerable = true;
        setTimeout(() => {
          this.invulnerable = false;
        }, 2000);
      }
    }
  }

  updateStatusBar() {
    if (this.world && this.world.statusBar) {
      this.world.statusBar.update(this.energy);
    }
  }

  reset() {
    this.x = 130;
    this.y = 150;
    this.isVisible = true;
    this.energy = 100;
    this.poisonCollected = 0;
    this.poisonStatusBar.setPercentage(0);
    this.CharacterHealthBar = new StatusBar();
    this.CharacterHealthBar.setPercentage(this.energy);
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
  }

  enterDoor(door) {
    this.isVisible = false;
    this.x = door.x;
    this.y = door.y;
    setTimeout(() => {
      this.isVisible = false;
      setTimeout(() => {
        this.x = 6471; 
        this.y = 210;
        this.world.camera_x = -this.x - 190; 
        this.isVisible = true;
        this.canMoveLeft = false; 
        isAfterDoor = true; 
        playNewSound(); 
      }, 200);
    }, 2000);
  }

  checkCollisionWithDoor(door) {
    if (!door) {
      return false;
    }
    const charBox = this.getCollisionBox();
    const doorBox = door.getCollisionBox();
    return (
      charBox.x < doorBox.x + doorBox.width &&
      charBox.x + charBox.width > doorBox.x &&
      charBox.y < doorBox.y + doorBox.height &&
      charBox.y + charBox.height > doorBox.y
    );
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
    console.log("Collecting key...");
    if (key && key.isActive) {
      key.deactivate();
      this.hasKey = true;
      console.log("Key collected! hasKey:", this.hasKey);
    }
  }

  attackEnemies() {
    const attackRange = 150;
    this.world.enemies.forEach((enemy) => {
      if (
        (enemy instanceof Knight ||
          enemy instanceof Snake ||
          enemy instanceof Endboss) &&
        !enemy.dead
      ) {
        const distance = Math.sqrt(
          Math.pow(this.x + this.width / 2 - (enemy.x + enemy.width / 2), 2) +
            Math.pow(this.y + this.height / 2 - (enemy.y + enemy.height / 2), 2)
        );
        if (distance <= attackRange) {
          enemy.takeDamage(10);
        }
      }
    });
  }

  throwObject() {
    if (this.canThrow() && !this.throwCooldown) {
      const endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);
      if (endboss) {
        let bottle = new ThrowableObject(this.x, this.y, endboss.x);
        this.world.throwableObjects.push(bottle);
        this.poisonCollected--;
        this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
        this.throwCooldown = true; // Setze die Abklingzeit
        setTimeout(() => {
          this.throwCooldown = false; // Hebe die Abklingzeit nach 1 Sekunde auf
        }, 1000);
      } else {
        console.error("Endboss not found");
      }
    }
  }

  canThrow() {
    return this.poisonCollected > 0;
  }

  draw(ctx) {
    if (this.isVisible) {
      super.draw(ctx);
    }
  }

  checkThrowableObject() {
    if (this.world.keyboard.D && this.poisonCollected > 0) {
      this.throwObject();
      playPoisonBottleSound();
    }
  }
}
