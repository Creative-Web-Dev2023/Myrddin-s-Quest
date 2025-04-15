/**
 * Class representing the collision handler.
 */
class CollisionHandler {
  /**
   * Creates an instance of CollisionHandler.
   * @param {Object} world - The game world.
   */
  constructor(world) {
    this.world = world;
    this.canThrow = true;
  }

  /**
   * Checks all collisions in the game.
   */
  checkCollisions() {
    this.checkCollisionWithPoisons();
    this.checkCollisionsWithEnemies();
    this.checkCollisionWithEndboss();
    this.checkCollisionWithKey();
    this.checkDoorCollision();
    this.checkTraps();
    this.checkThrowableObject();
    this.checkCrystalCollision();
  }

  /**
   * Checks if two objects are colliding.
   * @param {MovableObject} character - The character object.
   * @param {MovableObject} object - The other object.
   * @returns {boolean} True if the objects are colliding, false otherwise.
   */
  checkCollision(character, object) {
    if (!character || !object) return false;
    const charBox = character.getCollisionBox();
    const objBox = object.getCollisionBox();
    return (
      charBox.x < objBox.x + objBox.width &&
      charBox.x + charBox.width > objBox.x &&
      charBox.y < objBox.y + objBox.height &&
      charBox.y + charBox.height > objBox.y
    );
  }

  /**
   * Checks collisions with poisons.
   */
  checkCollisionWithPoisons() {
    this.world.poisonsArray.forEach((poison, index) => {
      if (this.checkCollision(this.world.character, poison)) {
        this.world.character.collectPoison(poison, index);
      }
    });
  }

  /**
   * Checks collisions with enemies.
   */
  checkCollisionsWithEnemies() {
    this.world.enemies.forEach((enemy) => {
      if (this.checkCollision(this.world.character, enemy)) {
        this.handleEnemyCollision(enemy);
      } else {
        this.checkEnemyAttack(enemy);
      }
    });
  }

  /**
   * Checks collisions with the endboss.
   */
  checkCollisionWithEndboss() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.collided) return;
      this.world.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && this.checkCollision(bottle, enemy)) {
          bottle.collided = true;
          bottle.isVisible = true;
          const damage = 25;
          const steps = Math.ceil(enemy.energy / 20) - 1;
          enemy.energy = Math.max(steps * 20, 0);
          enemy.statusBarEndboss.setPercentage(enemy.energy);
          if (enemy.energy <= 0) {
            enemy.die();
          }
        }
      });
    });
  }

  /**
   * Checks collisions with the key.
   */
  checkCollisionWithKey() {
    if (!this.world.character || !this.world.enemies) {
      return;
    }
    this.world.enemies.forEach((enemy, index) => {
      if (
        enemy instanceof Key &&
        this.checkCollision(this.world.character, enemy)
      ) {
        enemy.deactivate();
        this.world.enemies.splice(index, 1);
        this.world.character.collectKey(enemy);
      }
    });
  }

  /**
   * Handles collisions with enemies.
   * @param {MovableObject} enemy - The enemy object.
   */
  handleEnemyCollision(enemy) {
    if (enemy instanceof Snake || enemy instanceof Knight) {
      if (
        this.world.character.isAboveGround() &&
        this.world.character.speedY > 0
      ) {
        this.world.character.jump();
        if (!enemy.dead) {
          enemy.takeDamage(10);
        }
      } else {
        if (!enemy.isDead()) {
          this.world.character.hit(enemy);
          this.world.characterStatusBar.setPercentage(
            this.world.character.energy
          );
        }
      }
    } else {
      this.world.character.hit(enemy);
      this.world.characterStatusBar.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Checks if the enemy can attack the character.
   * @param {MovableObject} enemy - The enemy object.
   */
  checkEnemyAttack(enemy) {
    if (enemy instanceof Snake || enemy instanceof Knight) {
      const distance = Math.abs(this.world.character.x - enemy.x);
      if (distance <= 150 && !enemy.isDead()) {
        enemy.attack(this.world.character);
      }
    }
  }

  /**
   * Checks collisions with the door.
   */
  checkDoorCollision() {
    const character = this.world.character;
    const door = this.world.door;
    if (!door) {
      return;
    }
    if (this.checkCollision(character, door)) {
      character.enterDoor(door);
    }
  }

  /**
   * Resets the collision handler state.
   */
  resetCollisionState() {
    this.canThrow = true;
  }

  /**
   * Checks collisions with traps.
   */
  checkTraps() {
    if (this.world.traps) {
      this.world.traps.forEach((trap) => {
        if (this.checkCollision(this.world.character, trap)) {
          trap.isActive = true;
          this.world.character.takeDamage(10);
          this.world.characterStatusBar.setPercentage(
            this.world.character.energy
          );
        } else {
          trap.isActive = false;
        }
      });
    }
  }

  /**
   * Checks if the character can throw a throwable object.
   */
  checkThrowableObject() {
    if (
      this.world.keyboard.D &&
      this.canThrow &&
      this.world.character.poisonCollected > 0
    ) {
      this.world.character.throwPoisonBottle();
      this.canThrow = false;
      setTimeout(() => {
        this.canThrow = true;
      }, 500);
    }
  }

  /**
   * Checks collisions with the crystal.
   */
  checkCrystalCollision() {
    const crystal = this.world.crystal;
    if (crystal && this.isColliding(this.world.character, crystal)) {
      this.handleCrystalCollection(crystal);
    }
  }

  /**
   * Handles the collection of the crystal.
   * @param {MovableObject} crystal - The crystal object.
   */
  handleCrystalCollection(crystal) {
    this.world.character.collectCrystal(crystal);
    if (this.world.endGame &&typeof this.world.endGame.showWinScreen === "function") {
      this.world.endGame.showYouWinScreen();
    }
  }

  /**
   * Checks if the character is colliding with the crystal.
   * @param {MovableObject} character - The character object.
   * @param {MovableObject} crystal - The crystal object.
   * @returns {boolean} True if the character is colliding with the crystal, false otherwise.
   */
  isColliding(character, crystal) {
    return this.checkCollision(character, crystal);
  }
}