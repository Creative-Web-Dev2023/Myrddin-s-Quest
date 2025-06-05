/**
 * Handles all collision logic in the game world.
 */
class CollisionHandler {
  /**
   * Creates a new CollisionHandler.
   * @param {World} world - Reference to the game world.
   */
  constructor(world) {
    this.world = world;
    this.character = this.world.character;
    this.knights = this.world.knights;
    this.traps = this.world.traps;
    this.key = this.world.key;
    this.hearts = this.world.hearts;
    this.poisons = this.world.poisons;
    this.throwableObjects = this.world.throwableObjects;
    this.endboss = this.world.endboss;
    this.door = this.world.door;
    this.keyboard = this.world.keyboard;
  }

  /**
   * Checks collision between character and key.
   * If collision occurs, collects the key.
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
   * Checks for collisions between the character and collectable items in the specified property array.
   * If a collision is detected, optionally updates a target property of the character by a given amount (capped at 100),
   * plays a sound for the collected item, and removes the item from the array.
   *
   */
  checkCollisionWithCollectableItem( propertyName, sound, targetProperty, change = 0) {
    const array = this.world[propertyName];
    if (!array || array.length === 0) return;
    this.world[propertyName] = array.filter((item) => {
      if (this.character.isColliding(item)) {
        if (change !== 0 && targetProperty) {
          this.character[targetProperty] = Math.min(
            this.character[targetProperty] + change,100);
        }
        item.playSound(sound);
        return false;
      }
      return true;
    });
  }

  /**
   * Checks collision between character and knights.
   * Handles jumping on knights or taking damage.
   */
  checkCollisionWithKnight() {
    const toRemove = [];
    this.world.knights.forEach((knight) => {
      if (this.character.isColliding(knight)) {
        if (this.character.isAbove(knight)) {
          toRemove.push(knight);
          knight.playSound(LOADED_SOUNDS.knight.hurt);
        } else if (!this.character.invulnerable) {
          this.character.takeDamage( 20, LOADED_SOUNDS.character.hurt, LOADED_IMAGES.character.hurt);
        }
      }
    });
    this.world.knights = this.world.knights.filter(
      (k) => !toRemove.includes(k)
    );
  }

  /**
   * Checks collision between character and traps.
   * Handles trap activation and damage.
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
          this.character.takeDamage(20,LOADED_SOUNDS.character.hurt,LOADED_IMAGES.character.hurt);
        }
      }
    });
  }

  /**
   * Checks if the character is in the endboss trigger zone.
   * Triggers the endboss if overlap occurs.
   */
  checkCollisionWithTriggerZone() {
    const triggerZone = this.world.endboss.getTriggerZone();
    const wizardBox = this.world.character.getHitbox();
    if (!this.world.endboss.isDead() && !this.world.character.isDead()) {
      if (this.world.endboss.rectanglesOverlap(triggerZone, wizardBox)) {
        this.world.endboss.isTriggered = true;
      } else {
        this.world.endboss.isTriggered = false;
      }
    }
  }

  /**
   * Checks collision between throwable objects (bottles) and the endboss.
   * Handles damage and endboss death.
   */
  checkBottleCollisionWithEndboss() {
    this.world.throwableObjects.forEach((bottle) => {
      if (
        !bottle.hasHit &&
        this.world.endboss.isHitBy(bottle,bottle.offset,this.world.endboss.innerOffset)
      ) {
        bottle.registerHit();
        this.world.endboss.takeDamage(25,LOADED_SOUNDS.troll.hurt,LOADED_IMAGES.troll.hurt);
        if (this.world.endboss.energy === 0) {
          this.world.endboss.die();
        }
      }
    });
  }

  /**
   * Handles throwing objects (bottles) when the D key is pressed.
   * Reduces poison and adds a new throwable object.
   */
  checkThrowObjects() {
    if ( this.world.keyboard.D && this.world.character.poisonCollected > 0 && this.world.character.bottleReady) {
      this.world.character.bottleReady = false;
      let bottle = new ThrowableObject(this.character.x + 150,this.character.y + 80);
      this.world.throwableObjects.push(bottle);
      this.world.character.poisonCollected = Math.max(this.world.character.poisonCollected - 12.5,0);
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
   * Checks collision between the endboss and the character.
   * Handles damage to the character.
   */
  checkEndbossCollisionWithCharacter() {
    if (!this.endboss.isDead() &&this.endboss.isHitBy(this.character) &&!this.character.invulnerable) {
      this.character.takeDamage(10,LOADED_SOUNDS.character.hurt,LOADED_IMAGES.character.hurt);
    }
  }

  /**
   * Checks collision between the character and the door.
   * Handles victory or shows a message if the key is missing.
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
