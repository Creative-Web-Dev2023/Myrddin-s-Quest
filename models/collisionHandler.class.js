class CollisionHandler {
  constructor(world) {
    this.world = world;
    this.canThrow = true; 
  }

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

  checkCollisionWithKey() {
    if (!this.world.character || !this.world.enemies) {
      return;
    }
    this.world.enemies.forEach((enemy, index) => {
      if (enemy instanceof Key && this.checkCollision(this.world.character, enemy)) { 
        enemy.deactivate(); 
        this.world.enemies.splice(index, 1); 
        this.world.character.collectKey(enemy); 
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

  checkEnemyAttack(enemy) {
    if (enemy instanceof Snake) {
      const distance = Math.abs(this.world.character.x - enemy.x);
      if (distance <= 100 && !enemy.isDead()) {
        enemy.attack(this.world.character);
      }
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
          this.world.characterStatusBar.setPercentage(this.world.character.energy);
        } else {
          trap.isActive = false;
        }
      });
    }
  }

  checkThrowableObject() {
    if (this.world.keyboard.D && this.canThrow) {
      let bottle = new ThrowableObject(this.world.character.x, this.world.character.y);
      this.world.throwableObjects.push(bottle);
      this.canThrow = false; 
      setTimeout(() => {
        this.canThrow = true; 
      }, 500); 
    }
  } 

  checkCrystalCollision() {
    if(this.world.crystal?.isActive && 
       this.checkCollision(this.world.character, this.world.crystal)) {
        this.handleCrystalCollection();
    }
  }

  handleCrystalCollection() {
    this.world.crystal.deactivate();
    this.world.endGame.showVictoryScreen();
    this.world.gameLoop.running = false;
  }

}
