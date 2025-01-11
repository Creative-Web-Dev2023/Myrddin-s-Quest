class Knight extends MovableObject {
    constructor(x, id) {
      super();
      this.x = x;
      this.y = 190;
      this.id = id;
      this.width = 520;
      this.height = 290;
      this.health = 30;
      this.attackDamage = 10;
      this.attackRange = 80;
      this.dead = false;
  
      this.loadKnightImages();
    }
  
    loadKnightImages() {
      this.loadImage('img/knight/walk/walk 0.png');
      this.loadImages([
        'img/knight/walk/walk 0.png',
        'img/knight/walk/walk 1.png',
        'img/knight/walk/walk 2.png'
      ]);
    }
  
    update() {
      if (this.dead) return;
      this.move();
      this.checkAttack();
    }
  
    move() {
      this.x -= this.speed;
      if (this.x < 0) this.x = 0;
    }
  
    checkAttack() {
      if (!this.world || !this.world.character) return;
  
      const distance = Math.abs(this.x - this.world.character.x);
      if (distance < this.attackRange) {
        this.attack(this.world.character);
      }
    }
  
    attack(character) {
      if (this.dead) return;
      character.takeDamage(this.attackDamage);
    }
  }