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
      if (noises) {
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
        LOADED_SOUNDS.game.background.pause();
        LOADED_SOUNDS.game.background.currentTime = 0;
        this.world.triggerVictory();
        this.world.character.stopWalkingSound();
      });
    } else if (!this.character.keyCollected) {
      this.door.showMessage('You need to collect the key first!');
    }
  }
}