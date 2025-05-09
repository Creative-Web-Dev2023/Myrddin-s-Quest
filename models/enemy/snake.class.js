class Snake extends Enemy {
  constructor(startX = 400, moveRange = 100) {
    super();
    this.loadEnemyImages("snake");
    this.img = this.imageCache["walk_0"];
    this.x = this.initialX = startX;
    this.y = this.initialY = 320;

    this.width = 250;
    this.height = 160;
    this.offset = { top: 80, bottom: 40, left: 50, right: 50 };

    this.moveRange = moveRange;
    this.speed = 0.5;
    this.otherDirection = true;
    this.energy = 10;
    this.attackDamage = 10;
    this.attackRange = 30;

    this.IMAGES_WALK = LOADED_IMAGES.snake.walk;
    this.IMAGES_ATTACK = LOADED_IMAGES.snake.attack;
    this.IMAGES_HURT = LOADED_IMAGES.snake.hurt;
    this.IMAGES_DEAD = LOADED_IMAGES.snake.dead;
    console.log("Snake IMAGES:", {
      walk: this.IMAGES_WALK,
      attack: this.IMAGES_ATTACK,
      hurt: this.IMAGES_HURT,
      dead: this.IMAGES_DEAD,
    });
    this.startMovement();
  }

  die() {
    if (this.dead) return;
    playSnakeDyingSound();
    super.die();
  }
}
