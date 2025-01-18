class Drawer {
  constructor(world) {
    this.world = world;
  }
  draw() {
    console.log('Aktuelles Level in draw():', this.world.level);
    this.world.clearCanvas();
    this.drawBackground();
    this.drawTraps(); // Zeichne die Fallen
    this.drawEnemies();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawCharacter();
    this.drawSnakes();
    this.drawKey();

    if (this.world.door) {
      this.world.door.draw(this.world.ctx);
    }
    if (this.world.character.energy <= 0) {
      this.world.endGame.showYouLostScreen();
    }
  }

  drawBackground() {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.backgroundObjects);
    if (Array.isArray(this.world.level.clouds)) {
      this.world.addObjectsToMap(this.world.level.clouds);
    }
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  drawTraps() {
    console.log('drawTraps() aufgerufen'); // Debug-Log
    if (this.world.level !== level2) {
      console.log('Nicht level2, Fallen werden nicht gezeichnet.');
      return;
    }
    if (!this.world.level.traps || this.world.level.traps.length === 0) {
      console.log('Keine Fallen gefunden.');
      return;
    }
    console.log('Fallen gefunden:', this.world.level.traps);
  
    this.world.level.traps.forEach((trap, index) => {
      trap.draw(this.world.ctx);
      console.log(`Falle ${index + 1} gezeichnet:`, trap);
    });
  }

  drawStatusBars() {
    this.world.addToMap(this.world.poisonStatusBar);
    this.world.addToMap(this.world.characterStatusBar);
    if (this.world.currentLevelIndex === 1 && this.world.level.endboss) {
      this.world.endbossHealthBar.x = this.world.level.endboss.x;
      this.world.endbossHealthBar.y = this.world.level.endboss.y - 50;
      this.world.addToMap(this.world.endbossHealthBar);
      this.world.endbossHealthBar.draw(this.world.ctx);
    }
    this.world.addToMap(this.world.character.healthBar);
  }

  drawGameObjects() {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.enemies);
    this.world.addObjectsToMap(this.world.poisonsArray);
    this.world.throwableObjects.forEach((bottle) => {
      bottle.draw(this.world.ctx, this.world.camera_x);
    });
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  drawEnemies() {
    this.drawKnights();
    this.drawSnakes();
    this.drawEndboss();
  }

  drawKnights() {
    this.world.knights.forEach((knight) => {
      knight.draw(this.world.ctx);
    });
  }

  drawSnakes() {
    this.world.snakes.forEach((snake) => {
      snake.draw(this.world.ctx);
    });
    if (this.world.level === level2) {
      this.world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Snake) {
          enemy.draw(this.world.ctx);
        }
      });
    }
  }

  drawEndboss() {
    if (this.world.level === level2 && this.world.level.endboss) {
      this.world.level.endboss.draw(this.world.ctx);
    }
  }

  drawCharacter() {
    this.world.ctx.translate(this.world.camera_x, 0);
    if (this.world.character.isVisible) {
      this.world.addToMap(this.world.character);
    }
    this.world.characters.forEach((character) => {
      if (character.isVisible) {
        character.draw(this.world.ctx);
      }
    });
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  drawKey() {
    if (this.world.key) {
      this.world.key.draw(this.world.ctx);
    }
  }
}
