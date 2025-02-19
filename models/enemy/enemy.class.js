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
      this.attack(character);
    } else {
      this.patrol();
    }
  }

  isInAttackRange(character) {
    const distance = Math.abs(this.x - character.x);
    return distance < this.attackRange;
  }

  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
    setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const thisBox = this.getCollisionBox();
      const isStillInRange =
        thisBox.x < characterBox.x + characterBox.width &&
        thisBox.x + thisBox.width > characterBox.x &&
        thisBox.y < characterBox.y + characterBox.height &&
        thisBox.y + thisBox.height > characterBox.y;
      if (isStillInRange) {
        character.takeDamage(this.attackDamage);
      }
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }, 400);
  }

  removeEnemy() {
    this.dead = true;
    const index = this.world.enemies.indexOf(this);
    if (index > -1) {
      this.world.enemies.splice(index, 1);
    }
  }
}
