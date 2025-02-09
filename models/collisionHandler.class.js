/**
 * Class representing the collision handler.
 */
class CollisionHandler {
  /**
   * Creates an instance of CollisionHandler.
   * @param {Object} world - The world object.
   */
  constructor(world) {
    this.world = world;
    this.canThrow = true;
  }

  /**
   * Checks all collisions in the game world.
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
   * Checks collision between two objects.
   * @param {Object} character - The character object.
   * @param {Object} object - The object to check collision with.
   * @returns {boolean} - True if collision is detected, false otherwise.
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
   * Checks collision with poisons and handles the collection.
   */
  checkCollisionWithPoisons() {
    this.world.poisonsArray.forEach((poison, index) => {
      if (this.checkCollision(this.world.character, poison)) {
        this.world.character.collectPoison(poison, index);
      }
    });
  }

  /**
   * Checks collisions with enemies and handles the interactions.
   */
  checkCollisionsWithEnemies() {
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.deathAnimationPlayed) return;
      if (this.checkCollision(this.world.character, enemy)) {
        this.handleEnemyCollision(enemy);
      } else {
        this.checkEnemyAttack(enemy);
      }
    });
  }

  /**
   * Checks collision with the endboss and handles the interactions.
   */
  checkCollisionWithEndboss() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.collided) return;
      this.world.enemies.forEach((enemy) => {
        this.handleBottleEndbossCollision(bottle, enemy);
      });
    });
  }

  /**
   * Handles the collision between a bottle and the endboss.
   * @param {Object} bottle - The bottle object.
   * @param {Object} enemy - The enemy object.
   * @returns {boolean} - True if collision is detected, false otherwise.
   */
  handleBottleEndbossCollision(bottle, enemy) {
    if (!(enemy instanceof Endboss) || bottle.collided) return false;
    if (this.checkCollision(bottle, enemy)) {
      this.processBottleImpact(bottle, enemy);
      return true;
    }
    return false;
  }

  /**
   * Processes the impact of a bottle on the endboss.
   * @param {Object} bottle - The bottle object.
   * @param {Object} endboss - The endboss object.
   */
  processBottleImpact(bottle, endboss) {
    bottle.collided = true;
    bottle.isVisible = true;
    this.damageEndboss(endboss, 25);
  }

  /**
   * Damages the endboss and updates its status.
   * @param {Object} endboss - The endboss object.
   * @param {number} damage - The amount of damage to inflict.
   */
  damageEndboss(endboss, damage) {
    const steps = Math.ceil(endboss.energy / 20) - 1;
    endboss.energy = Math.max(steps * 20, 0);
    endboss.statusBarEndboss.setPercentage(endboss.energy);
    if (endboss.energy <= 0) {
      endboss.die();
    }
  }

  /**
   * Checks collision with the key and handles the collection.
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
   * Handles the collision with an enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleEnemyCollision(enemy) {
    if (enemy instanceof Snake || enemy instanceof Knight) {
      this.handleHumanoidEnemyCollision(enemy);
    } else {
      this.handleGenericEnemyCollision(enemy);
    }
  }

  /**
   * Handles the collision with a humanoid enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleHumanoidEnemyCollision(enemy) {
    if (this.isCharacterStomping()) {
      this.handleStompAttack(enemy);
    } else {
      this.handleHorizontalCollision(enemy);
    }
  }

  /**
   * Checks if the character is stomping.
   * @returns {boolean} - True if the character is stomping, false otherwise.
   */
  isCharacterStomping() {
    return (
      this.world.character.isAboveGround() && this.world.character.speedY > 0
    );
  }

  /**
   * Handles the stomp attack on an enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleStompAttack(enemy) {
    this.world.character.jump();
    if (!enemy.isDead()) {
      enemy.takeDamage(10);
    }
  }

  /**
   * Handles the horizontal collision with an enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleHorizontalCollision(enemy) {
    if (!enemy.isDead()) {
      this.applyCharacterDamage(enemy);
    }
  }

  /**
   * Handles the generic collision with an enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleGenericEnemyCollision(enemy) {
    this.applyCharacterDamage(enemy);
  }

  /**
   * Applies damage to the character.
   * @param {Object} damageSource - The source of the damage.
   */
  applyCharacterDamage(damageSource) {
    this.world.character.hit(damageSource);
    this.updateCharacterStatusBar();
  }

  /**
   * Updates the character's status bar.
   */
  updateCharacterStatusBar() {
    this.world.characterStatusBar.setPercentage(this.world.character.energy);
  }

  /**
   * Checks if an enemy is attacking the character.
   * @param {Object} enemy - The enemy object.
   */
  checkEnemyAttack(enemy) {
    if (enemy instanceof Snake) {
      const distance = Math.abs(this.world.character.x - enemy.x);
      if (distance <= 100 && !enemy.isDead()) {
        enemy.attack(this.world.character);
      }
    }
  }

  /**
   * Checks collision with the door and handles the interaction.
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
   * Checks collision with traps and handles the interaction.
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
   * Checks if a throwable object can be thrown and handles the interaction.
   */
  checkThrowableObject() {
    if (this.world.keyboard.D && this.canThrow) {
      let bottle = new ThrowableObject(
        this.world.character.x,
        this.world.character.y
      );
      this.world.throwableObjects.push(bottle);
      this.canThrow = false;
      playPoisonBottleSound(); // Füge den Aufruf hinzu, um den Sound abzuspielen
      setTimeout(() => {
        this.canThrow = true;
      }, 500);
    }
  }

  /**
   * Checks collision with the crystal and handles the collection.
   */
  checkCrystalCollision() {
    if (
      this.world.crystal?.isActive &&
      this.checkCollision(this.world.character, this.world.crystal)
    ) {
      this.world.character.collectCrystal(this.world.crystal);
    }
  }

  /**
   * Handles the collection of the crystal and ends the game.
   */
  handleCrystalCollection() {
    if (this.world.endGame) {
      this.world.endGame.showWinScreen();
      this.world.character.isInvulnerable = true;
      this.world.enemies = [];
      this.world.throwableObjects = [];
      if (this.world.gameLoop) {
        this.world.gameLoop.running = false;
        this.world.gameLoop = null;
      }
    }
  }
}
