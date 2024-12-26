class World {
  // ...existing code...

  update() {
    // ...existing code...
    this.updateKnightHealthBars();
    if (this.door) {
      this.door.checkDoorCollision(this.character, this);
    }
    // ...existing code...
  }

  updateKnightHealthBars() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Knight && typeof enemy.updateHealthBar === 'function') {
        enemy.updateHealthBar();
      }
    });
  }

  draw() {
    // ...existing code...
    this.drawKnightHealthBars();
    // ...existing code...
  }

  drawKnightHealthBars() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Knight && enemy.healthBar) {
        enemy.healthBar.draw(this.ctx);
      }
    });
  }

  // ...existing code...
}
