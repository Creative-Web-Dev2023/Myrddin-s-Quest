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
    console.log("Geladene Angriffsbilder:", LOADED_IMAGES.character.attack);
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
    this.currentAnimation = LOADED_IMAGES.character.idle;
    this.animate();
    this.canMoveLeftFlag = true;
  }

  /**
   * Initializes the character.
   */
  initCharacter() {
    this.applyGravity();
    this.energy = 100;
    this.x = 4000;
    // this.x = 90;
    // this.y = 150;
    this.poisonStatusBar.setPercentage(0);
    this.healthBar = new StatusBar();
    this.world.characterStatusBar = this.healthBar;
    this.world.camera_x = -this.x - 190;
    this.canMoveLeftFlag = true;
    this.img = this.imageCache["idle_0"];
  }

  /**
   * Updates the character's state.
   */
  update() {
    if (!this.isVisible || this.energy <= 0) return;
    this.handleState();
    this.updateCamera();
      this.animate();
  }

  animate() {
    this.setCustomInterval(() => {
      if (this.isDead()) {
        this.stopAllAnimations();
        return;
      }
      if (this.isAttacking) {
        this.playGenericAnimation(LOADED_IMAGES.character.attack, 100,false,
          "attack"
        );}

      else if (this.isHurt()) {
        this.playGenericAnimation( LOADED_IMAGES.character.hurt, 400,false,
          "hurt"
        );
      } else if (this.isAboveGround()) {
        this.playGenericAnimation( LOADED_IMAGES.character.jump, 100, false,
          "jump"
        );
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playGenericAnimation(  LOADED_IMAGES.character.walk, 100,true,
          "walk"
        );
      } else {
        this.playGenericAnimation(LOADED_IMAGES.character.idle,  200,  true,
          "idle"
        );
      }
    }, 100);
  }

  get movement() {
    return {
      right:
        this.world.keyboard.RIGHT &&
        this.x < this.world.level.level_end_x + 200,
      left: this.world.keyboard.LEFT && this.x > 0 && this.canMoveLeft(),
      jump: this.world.keyboard.JUMP,
    };
  }

  handleState() {
    if (this.movement.right) this.moveRight();
    if (this.movement.left) this.moveLeft();
    if (this.movement.jump) this.jump();
    if (this.world.keyboard.ATTACK && !this.isAttacking) this.playAttack(); // Überprüfe, ob der Angriff ausgelöst werden soll
  }

  /**
   * Handles the character's actions.
   */
  handleActions() {
    if (this.world.keyboard.ATTACK && !this.isAttacking) {
      this.isAttacking = true;
      this.currentAttackFrame = 0;
      playAttackSound();

      this.attackEnemies();
    }
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
    super.takeDamage(damage);
    this.world.characterStatusBar.setPercentage(this.energy);
    this.playAnimation(LOADED_IMAGES.character.hurt);
  }
  /**
   * Handles the character's death.
   */
  die() {
    if (this.deadAnimationPlayed) return;
    this.deadAnimationPlayed = true;
    this.saveLastPosition();
    this.stopAllAnimations();
    this.playGenericAnimation(
      LOADED_IMAGES.character.die,
      150,
      false,
      "die",
      () => {
        this.isVisible = false;
        this.world.endGame.showYouLostScreen();
      }
    );
  }

  playAttack() {
    if (this.isAttacking) return; 
    this.isAttacking = true;
    this.playGenericAnimation( LOADED_IMAGES.character.attack,  100,  false,
      "attack",
      () => {
        this.isAttacking = false;
      }
    );
    this.executeAttack(); 
  }

  playDeath() {
    this.playGenericAnimation(LOADED_IMAGES.character.die, 150, false, () => {
      this.isVisible = false;
      this.world.endGame.showYouLostScreen();
    });
  }

  /**
   * Stops all animations.
   */
  stopAllAnimations() {
    this.animationIntervals.forEach(clearInterval);
    this.animationIntervals = [];
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

  draw(ctx) {
    if (!this.isVisible) return;
    this.drawWithCollisionBox(ctx);
  }

  dealDamageToEnemy(enemy, damage = 10) {
    if (!enemy.dead && Math.abs(this.x - enemy.x) < 150) {
      enemy.takeDamage(damage);
      if (enemy instanceof Endboss) {
        enemy.statusBarEndboss.setPercentage(enemy.energy);
      }
    }
  }

  executeAttack() {
    this.world.enemies.forEach((enemy) => this.dealDamageToEnemy(enemy));
  }

  fullReset(position = {}) {
    this.stopAllAnimations();
    Object.assign(this, {
      x: position.x || 90,
      y: position.y || 150,
      energy: 100,
      poisonCollected: 5,
      isVisible: true,
      deadAnimationPlayed: false,
      speedY: 0,
    });
    this.poisonStatusBar.setPercentage(this.poisonCollected * 20);
    this.playAnimation(LOADED_IMAGES.character.idle);
    this.applyGravity();
  }

  /**
   * Sets a custom interval and tracks it for cleanup.
   * @param {Function} callback - The function to execute at each interval.
   * @param {number} interval - The interval time in milliseconds.
   */
  setCustomInterval(callback, interval) {
    const intervalId = setInterval(callback, interval);
    this.animationIntervals.push(intervalId);
  }
}
