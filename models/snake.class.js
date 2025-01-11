class Snake extends MovableObject {
  constructor(x, y, id) {
      super();
      this.x = x;
      this.y = y;
      this.id = id;
      this.width = 250;
      this.height = 150;
      this.health = 10;
      this.attackDamage = 10;
      this.attackRange = 100;
      this.dead = false;

      this.loadSnakeImages();
  }

  loadSnakeImages() {
      this.loadImage('img/snake/walk/Walk1.png');
      this.loadImages([
          'img/snake/walk/Walk1.png',
          'img/snake/walk/Walk2.png',
          'img/snake/walk/Walk3.png',
          'img/snake/walk/Walk4.png'
      ]);
  }

  attack(character) {
      if (this.dead) return;
      
      const distance = Math.abs(this.x - character.x);
      if (distance < this.attackRange) {
          character.takeDamage(this.attackDamage);
      }
  }

  takeDamage(damage) {
      if (this.dead) return;
      
      this.health -= damage;
      if (this.health <= 0) {
          this.die();
      }
  }

  die() {
      this.dead = true;
      if (this.world) {
          const index = this.world.enemies.indexOf(this);
          if (index !== -1) {
              this.world.enemies.splice(index, 1);
          }
      }
  }
}