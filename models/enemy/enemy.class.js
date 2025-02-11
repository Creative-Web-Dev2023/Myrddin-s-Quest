class Enemy extends MovableObject {
  static nextId = 1;

  constructor(id) {
    super();
    this.id = id || Enemy.nextId++;
    this.energy = 100;
    this.dead = false;
    this.isAttacking = false;
    this.deathAnimationPlayed = false;
    this.isRemoved = false;
    this.speed = 1;
    this.attackRange = 150;
    this.attackDamage = 10;
    this.otherDirection = false;
    this.initialX = this.x;
    this.initialY = this.y;
  }

  setWorld(world) {
    this.world = world;
    if (!world.enemies.includes(this)) {
      world.enemies.push(this);
    }
  }

  patrol() {
    if (this.dead) return;
    this.x += this.otherDirection ? -this.speed : this.speed;
  }

  update(character) {
    if (this.isDead()) return;
    if (this.isInAttackRange(character)) {
      this.playAnimation(this.IMAGES_ATTACKING);
    } else {
      this.patrol();
    }
  }

  isInAttackRange(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
  }

  removeEnemy() {
    this.dead = true;
    const index = this.world.enemies.indexOf(this);
    if (index > -1) {
      this.world.enemies.splice(index, 1);
    }
  }
  
  resetPosition() {
    this.x = this.initialX;
    this.y = this.initialY;
  }
}
