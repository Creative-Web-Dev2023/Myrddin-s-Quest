class Knight extends Enemy {
  constructor(delay, startX, moveRange) {
    super(); 
    this.loadEnemyImages("knight");

    this.x = startX;
    this.initialX = startX;
    this.y = 190;
    this.width = 520;
    this.height = 290;
    this.offset = { top: 120, bottom: 70, left: 210, right: 210 };
    this.moveRange = moveRange;
    this.speed = 0.5;
    this.patrolLeftLimit = startX - moveRange;
    this.patrolRightLimit = startX + moveRange;
    this.otherDirection = true;
    this.energy = 100;
    this.attackDamage = 20;
    this.attackRange = 50;
    this.maxHits = 3;
    this.hits = 0;
    this.isInvulnerable = false;
    this.healthDisplay = new KnightHealthDisplay(this);
    this.IMAGES_WALK = LOADED_IMAGES.knight.walk;
    this.IMAGES_ATTACK = LOADED_IMAGES.knight.attack;
    this.IMAGES_HURT = LOADED_IMAGES.knight.hurt;
    this.IMAGES_DEAD = LOADED_IMAGES.knight.dead;
     console.log("Knight IMAGES:", {
      walk: this.IMAGES_WALK,
      attack: this.IMAGES_ATTACK,
      hurt: this.IMAGES_HURT,
      dead: this.IMAGES_DEAD,
    });
    setTimeout(() => {
      this.startPatrol(this.patrolLeftLimit, this.patrolRightLimit);
      this.startStandardAnimation();
    }, delay);
  }

  isInAttackRange(character) {
    if (!character) return false;
    return (this.x - character.x) < this.attackRange;
  }

  takeDamage(damage) {
    if (this.dead || this.isInvulnerable) return;
    this.isInvulnerable = true;
    setTimeout(() => (this.isInvulnerable = false), 500);

    this.hits = Math.min(this.hits + 1, this.maxHits);
    super.takeDamage(100 / this.maxHits); 
    this.healthDisplay.updateHits(this.hits);
    playEnemyHitSound();

    if (this.hits >= this.maxHits) {
      this.die();
    }
  }

  draw(ctx) {
    super.draw(ctx); 
    this.healthDisplay.updatePosition(this.x, this.y, this.width); 
    this.healthDisplay.draw(ctx); 
  }
}
