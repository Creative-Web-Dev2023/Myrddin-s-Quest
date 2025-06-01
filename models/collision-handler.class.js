/**
 * Handles all collision logic in the game world.
 */
class CollisionHandler {
  /**
   * @param {Object} world - The game world instance.
   */
  constructor(world) {
    /**
     * @type {Object}
     */
    this.world = world;
    /**
     * @type {Object}
     */
    this.character = this.world.character;
    /**
     * @type {Array}
     */
    this.knights = this.world.knights;
    /**
     * @type {Array}
     */
    this.traps = this.world.traps;
    /**
     * @type {Object}
     */
    this.key = this.world.key;
    /**
     * @type {Array}
     */
    this.hearts = this.world.hearts;
    /**
     * @type {Array}
     */
    this.poisons = this.world.poisons;
    /**
     * @type {Array}
     */
    this.throwableObjects = this.world.throwableObjects;
    /**
     * @type {Object}
     */
    this.endboss = this.world.endboss;
    /**
     * @type {Object}
     */
    this.door = this.world.door;
    this.keyboard = this.world.keyboard;
  }

  /**
   * Checks collision between character and key.
   * If collision occurs, marks key as collected and plays sound.
   */
  checkCollisionWithKey() {
    if (!this.key) return;
    if (this.character.isColliding(this.key)) {
      this.character.keyCollected = true;
      if (noises) {
        this.key.pingSound.pause();
        this.key.pingSound.currentTime = 0;
        this.key.pingSound.play();
      }
      this.world.key = null;
    }
  }

  /**
   * Checks collision between character and a collectable item array.
   * @param {string} propertyName - The property name of the collectable array in world.
   * @param {Object} sound - The sound to play on collection.
   * @param {string} targetProperty - The character property to modify.
   * @param {number} [change=0] - The value to add to the character property.
   */
  checkCollisionWithCollectableItem(
    propertyName,
    sound,
    targetProperty,
    change = 0
  ) {
    const array = this.world[propertyName];
    if (!array || array.length === 0) return;
    this.world[propertyName] = array.filter((item) => {
      if (this.character.isColliding(item)) {
        if (change !== 0 && targetProperty) {
          this.character[targetProperty] = Math.min(
            this.character[targetProperty] + change,
            100
          );
        }
        item.playSound(sound);
        return false;
      }
      return true;
    });
  }

  /**
   * Checks collision between character and knights.
   * Removes knight if character jumps on it, otherwise character takes damage.
   */
  checkCollisionWithKnight() {
    const toRemove = [];
    this.world.knights.forEach((knight) => {
      if (this.character.isColliding(knight)) {
        if (this.character.isAbove(knight)) {
          toRemove.push(knight);
          knight.playSound(LOADED_SOUNDS.knight.hurt);
        } else if (!this.character.invulnerable) {
          this.character.takeDamage(
            20,
            LOADED_SOUNDS.character.hurt,
            LOADED_IMAGES.character.hurt
          );
        }
      }
    });
    this.world.knights = this.world.knights.filter(
      (k) => !toRemove.includes(k)
    );
  }

  /**
   * Checks collision between character and traps.
   * If above trap, shuts trap and sets energy to 0. Otherwise, character takes damage.
   */
  checkCollisionWithTrap() {
    this.traps.forEach((trap) => {
      if (this.character.isColliding(trap)) {
        if (this.character.isAbove(trap, 30)) {
          trap.shutTrap();
          this.character.energy = 0;
        } else if (
          !this.character.invulnerable &&
          !this.character.isDeadAlready
        ) {
          trap.playSound(LOADED_SOUNDS.trap.snap);
          this.character.takeDamage(
            20,
            LOADED_SOUNDS.character.hurt,
            LOADED_IMAGES.character.hurt
          );
        }
      }
    });
  }

  /**
   * Checks if any thrown bottle collides with the endboss.
   * If so, endboss takes damage and may die.
   */
  checkBottleCollisionWithEndboss() {
    this.world.throwableObjects.forEach((bottle) => {
      if (
        !bottle.hasHit &&
        this.world.endboss.isHitBy(
          bottle,
          bottle.offset,
          this.world.endboss.innerOffset
        )
      ) {
        bottle.registerHit();
        this.world.endboss.takeDamage(
          25,
          LOADED_SOUNDS.troll.hurt,
          LOADED_IMAGES.troll.hurt
        );
        if (this.world.endboss.energy === 0) {
          this.world.endboss.die();
        }
      }
    });
  }

  /**
   * Handles logic for throwing objects (bottles/poison).
   * Checks if throw is possible and updates state accordingly.
   */
  checkThrowObjects() {
    if (
      this.world.keyboard.D &&
      this.world.character.poisonCollected > 0 &&
      this.world.character.bottleReady
    ) {
      this.world.character.bottleReady = false;
      let bottle = new ThrowableObject(
        this.character.x + 150,
        this.character.y + 80
      );
      this.world.throwableObjects.push(bottle);
      this.world.character.poisonCollected = Math.max(
        this.world.character.poisonCollected - 20,
        0
      );
      bottle.playSound(LOADED_SOUNDS.poison.thrown);
      this.world.character.poisonBar.setPercentage(
        this.character.poisonCollected
      );
    }
    if (!this.keyboard.D) {
      this.world.character.bottleReady = true;
    }
  }

  /**
   * Checks collision between endboss and character.
   * If collision and not invulnerable, character takes damage.
   */
  checkEndbossCollisionWithCharacter() {
    if (
      !this.endboss.isDead() &&
      this.endboss.isHitBy(this.character) &&
      !this.character.invulnerable
    ) {
      this.character.takeDamage(
        10,
        LOADED_SOUNDS.character.hurt,
        LOADED_IMAGES.character.hurt
      );
    }
  }

  /**
   * Checks collision between character and door.
   * If key is collected, triggers victory. Otherwise, shows message.
   */
  checkCollisionCharacterDoor() {
    if (!this.character.isColliding(this.door)) return;
    if (this.character.keyCollected && !this.world.victoryTriggered) {
      this.world.victoryTriggered = true;
      this.door.open(() => {
        LOADED_SOUNDS.game.background.pause();
        LOADED_SOUNDS.game.background.currentTime = 0;
        this.world.triggerVictory();
        this.world.character.stopWalkingSound();
      });
    } else if (!this.character.keyCollected) {
      this.door.showMessage("You need to collect the key first!");
    }
  }
}
