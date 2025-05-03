/**
 * Class representing the drawer for the game world.
 */
class Drawer {
  /**
   * Creates an instance of Drawer.
   * @param {Object} world - The world object.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws the entire game world.
   */
  draw() {
    this.world.clearCanvas();
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawEnemies();
    this.drawDoor();
    this.drawCharacter();
    this.drawSnakes();
    this.drawTraps();
    this.drawKey();
    this.drawCrystal();
  }

  /**
   * Draws the background of the game world.
   */
  drawBackground() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.backgroundObjects);

    // Wolken zeichnen
    if (this.world.clouds && Array.isArray(this.world.clouds.clouds)) {
      this.world.clouds.clouds.forEach((cloud, index) => {

        cloud.draw(this.world.ctx); // Wolken zeichnen
      });
    } else {
      console.warn("[Drawer] Keine Wolken zum Zeichnen gefunden.");
    }

    this.world.ctx.restore();
  }

  /**
   * Draws the status bars in the game world.
   */
  drawStatusBars() {
    this.world.addToMap(this.world.poisonStatusBar);
    this.world.addToMap(this.world.characterStatusBar);
    if (this.world.level.endboss) {
      this.world.level.endboss.updateStatusBarPosition();
      this.world.addToMap(this.world.level.endboss.statusBarEndboss);
    }
    this.world.addToMap(this.world.character.healthBar);
  }

  /**
   * Draws the game objects in the game world.
   */
  drawGameObjects() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0); 

    // Poison-Objekte zeichnen
    this.world.poisonsArray.forEach((poison, index) => {
      console.log(`[Drawer] Zeichne Poison ${index} bei x=${poison.x}, y=${poison.y}`); 
      poison.draw(this.world.ctx);
    });

    this.world.addObjectsToMap(this.world.enemies);
    this.world.addObjectsToMap(this.world.traps);
    this.world.throwableObjects.forEach((bottle) => {
      bottle.draw(this.world.ctx, this.world.camera_x);
    });

    this.world.ctx.restore();
  }

  /**
   * Draws the enemies in the game world.
   */
  drawEnemies() {
    this.world.enemies.forEach((enemy) => {
      enemy.draw(this.world.ctx);
    });
    if (this.world.level.endboss) {
      this.world.level.endboss.draw(this.world.ctx);
    }
  }

  /**
   * Draws the character in the game world.
   */
  drawCharacter() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    if (this.world.character.isVisible) {
      this.world.addToMap(this.world.character);
      this.world.character.drawFrame();
    }

    this.world.ctx.restore();
  }

  /**
   * Draws the snakes in the game world.
   */
  drawSnakes() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.snakes);
    this.world.ctx.restore();
  }

  drawDoor() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addToMap(this.world.door);
    this.world.ctx.restore();
  }

  /**
   * Draws the traps in the game world.
   */
  drawTraps() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.traps.forEach((trap) => {
      trap.draw(this.world.ctx);
    });
    this.world.ctx.restore();
  }

  drawKey() {
    if (this.world.key && this.world.key.isActive) {
      this.world.addToMap(this.world.key);
      this.world.ctx.save();
      this.world.ctx.translate(this.world.camera_x, 0);
      this.world.addToMap(this.world.key);
      this.world.ctx.restore();
    }
  }

  drawCrystal() {
    if (this.world.crystal && this.world.crystal.isActive) {
      this.world.ctx.save();
      this.world.ctx.translate(this.world.camera_x, 0);
      this.world.addToMap(this.world.crystal);
      this.world.ctx.restore();
    }
  }
  /**
   * Draws the throwable objects.
   */
  drawThrowableObjects() {
    this.world.throwableObjects.forEach((obj) => {
      obj.draw(this.world.ctx);
      if (obj.isColliding(this.world.level.endboss)) {
        this.world.updateEndbossHealth(obj.damage);
        this.world.characterStatusBar.update(this.world.character.energy);
        obj.deactivate();
      }
    });
  }

  /**
   * Draws the guard range of the endboss.
   */
  drawEndbossGuardRange() {
    if (this.world.level.endboss) {
      this.world.level.endboss.drawGuardRange(this.world.ctx);
    }
  }
}
