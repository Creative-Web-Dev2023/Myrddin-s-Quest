class CollisionHandler {
  constructor(world) {
    this.world = world;
  }

  checkCollisions() {
    this.checkCollisionWithPoisons();
    this.checkCollisionsWithEnemies();
    this.checkCollisionWithKey();
    this.checkDoorCollision();
    this.checkTraps();
    this.checkThrowableObjectsCollision(); // Füge die Kollisionserkennung für geworfene Objekte hinzu
  }

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

  checkCollisionWithPoisons() {
    this.world.poisonsArray.forEach((poison, index) => {
      if (this.checkCollision(this.world.character, poison)) {
        this.world.character.collectPoison(poison, index);
      }
    });
  }

  checkCollisionsWithEnemies() {
    this.world.enemies.forEach((enemy) => {
      if (this.checkCollision(this.world.character, enemy)) {
        this.handleEnemyCollision(enemy);
      } else {
        this.checkEnemyAttack(enemy);
      }
    });
  }

  handleEnemyCollision(enemy) {
    if (enemy instanceof Snake || enemy instanceof Knight) {
      if (
        this.world.character.isAboveGround() &&
        this.world.character.speedY > 0
      ) {
        this.world.character.jump();
        if (!enemy.isDead()) {
          enemy.takeDamage(enemy.energy); // Verursacht maximalen Schaden
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

  checkEnemyAttack(enemy) {
    if (enemy instanceof Snake) {
      const distance = Math.abs(this.world.character.x - enemy.x);
      if (distance <= 100 && !enemy.isDead()) {
        enemy.attack(this.world.character);
      }
    }
  }

  checkCollisionWithKey() {
    if (!this.world.character || !this.world.key || !this.world.key.isActive) {
      return;
    }
    if (this.checkCollision(this.world.character, this.world.key)) {
      console.log("Collision detected! Collecting key...");
      this.world.character.collectKey(this.world.key);
    }
  }

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

  checkThrowableObjectsCollision() {
    this.world.throwableObjects.forEach((obj) => {
      if (this.checkCollision(obj, this.world.level.endboss)) {
        console.log("Endboss hit by throwable object!");
        this.world.level.endboss.takeDamage(10); // Verursacht Schaden am Endboss
        obj.deactivate(); // Deaktiviere das geworfene Objekt
        obj.stop(); // Stoppe die Bewegung der Flasche
      }
    });
  }
  
}
