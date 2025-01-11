class World {
  constructor(canvas, keyboard) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.keyboard = keyboard;
      this.character = new Character(this);
      this.enemies = [];
      this.level = 1;
      
      this.loadLevel();
      this.gameLoop();
  }

  loadLevel() {
      const levels = {
          1: [
              new Knight(800, 1),
              new Knight(1500, 2)
          ],
          2: [
              new Snake(900, 200, 1),
              new Snake(1800, 200, 2),
              new Snake(3000, 200, 3)
          ]
      };

      this.enemies = levels[this.level] || [];
      this.enemies.forEach(enemy => enemy.world = this);
  }

  update() {
      if (this.character.isDead()) return;

      this.character.update();
      this.updateEnemies();
      this.checkCollisions();
  }

  updateEnemies() {
      this.enemies.forEach(enemy => {
          if (!enemy.dead) {
              enemy.update();
          }
      });
  }

  checkCollisions() {
      this.enemies.forEach(enemy => {
          if (!enemy.dead && this.isColliding(this.character, enemy)) {
              if (this.character.isJumping()) {
                  enemy.takeDamage(30);
                  this.character.bounce();
              } else {
                  enemy.attack(this.character);
              }
          }
      });
  }

  isColliding(a, b) {
      return (
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y
      );
  }

  draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.character.draw(this.ctx);
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
  }

  gameLoop() {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
  }
}