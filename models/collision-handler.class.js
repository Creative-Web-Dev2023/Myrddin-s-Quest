class CollisionHandler {
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

  checkCollisionWithKey() {
    if (!this.key) return;

    if (this.character.isColliding(this.key)) {
      this.character.keyCollected = true;
      if (sounds) {
        this.key.pingSound.pause();
        this.key.pingSound.currentTime = 0;
        this.key.pingSound.play();
      }

      this.world.key = null;
    }
  }

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

  checkCollisionWithTrap() {
    this.traps.forEach((trap) => {
      if (this.character.isColliding(trap)) {
        if (this.character.isAbove(trap, 30)) {
          trap.shutTrap();
          this.character.energy = 0;
        } else if (!this.character.invulnerable) {
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

  checkBottleCollisionWithEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (
        !bottle.hasHit &&
        this.endboss.isHitBy(bottle, bottle.offset, this.endboss.innerOffset)
      ) {
        bottle.registerHit();
        this.endboss.takeDamage(
          25,
          LOADED_SOUNDS.troll.hurt,
          LOADED_IMAGES.troll.hurt
        );
        console.log('Troll-Energie: ', this.endboss.energy);
        if (this.endboss.energy === 0) {
          this.endboss.die();
        }
      }
    });
  }

  checkThrowObjects() {
    if (
      this.keyboard.D &&
      this.character.poisonCollected > 0 &&
      this.character.bottleReady
    ) {
      this.character.bottleReady = false;
      let bottle = new ThrowableObject(
        this.character.x + 150,
        this.character.y + 80
      );
      this.throwableObjects.push(bottle);
      this.character.poisonCollected = Math.max(
        this.character.poisonCollected - 20,
        0
      );
      bottle.playSound(LOADED_SOUNDS.poison.thrown);
      this.character.poisonBar.setPercentage(this.character.poisonCollected);
    }

    if (!this.keyboard.D) {
      this.character.bottleReady = true;
    }
  }

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

  checkCollisionCharacterDoor() {
    if (!this.character.isColliding(this.door)) return;

    if (this.character.keyCollected && !this.world.victoryTriggered) {
      this.world.victoryTriggered = true;
      this.door.open(() => {
        this.world.triggerVictory();
        this.world.character.stopWalkingSound();
      });
    } else if (!this.character.keyCollected) {
      this.door.showMessage('You need to collect the key first!');
      console.log('You need to collect the key first!');
    }
  }
}