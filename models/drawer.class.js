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
    if (this.world.character.energy <= 0) {
      this.world.endGame.showYouLostScreen();
    }
  }

  /**
   * Draws the background of the game world.
   */
  drawBackground() {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.world.addObjectsToMap(this.world.backgroundObjects);
    if (Array.isArray(this.world.level.clouds)) {
      this.world.addObjectsToMap(this.world.level.clouds);
    }
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Draws the status bars in the game world.
   */
  drawStatusBars() {
    this.world.addToMap(this.world.poisonStatusBar);
    this.world.addToMap(this.world.characterStatusBar);
    if (this.world.currentLevelIndex === 1 && this.world.level.endboss) {
      this.world.endbossHealthBar.x = this.world.level.endboss.x;
      this.world.endbossHealthBar.y = this.world.level.endboss.y - 50;
      const healthPercentage = (this.world.level.endboss.energy / 100) * 100;
      this.world.endbossHealthBar.setPercentage(healthPercentage);
      this.world.addToMap(this.world.endbossHealthBar);
    }
    this.world.addToMap(this.world.character.healthBar);
  }

  /**
   * Draws the game objects in the game world.
   */
  drawGameObjects() {
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
    this.world.ctx.translate(-this.world.camera_x, 0);
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
}
