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
    this.drawCharacter();
    this.drawSnakes();
    this.drawTraps();
    if (this.world.door) {
      this.world.door.draw(this.world.ctx);
     }
  }

  /**
   * Draws the background of the game world.
   */
  drawBackground() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.backgroundObjects);
    if (Array.isArray(this.world.level.clouds)) {
      this.world.addObjectsToMap(this.world.level.clouds);
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
    this.world.addObjectsToMap(this.world.enemies);
    this.world.addObjectsToMap(this.world.poisonsArray);
    if (this.world.key && this.world.key.isActive) {
      this.world.key.draw(this.world.ctx);
    }
    this.world.throwableObjects.forEach((bottle) => {
      bottle.draw(this.world.ctx, this.world.camera_x);
    });
    this.world.addObjectsToMap(this.world.traps);
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
    }
    this.world.characters.forEach((character) => {
      if (character.isVisible) {
        character.draw(this.world.ctx);
      }
    });
    this.world.ctx.restore();
  }

  /**
   * Draws the snakes in the game world.
   */
  drawSnakes() {
    this.world.snakes.forEach((snake) => {
      snake.draw(this.world.ctx);
    });
  }

  /**
   * Draws the traps in the game world.
   */
  drawTraps() {
    this.world.traps.forEach((trap) => {
      trap.draw(this.world.ctx);
    });
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
