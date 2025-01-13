class Snake extends Enemy {
  constructor(startX = 400, moveRange = 100, id) {
    super();
    this.id = id;
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 150;
    this.y = 240; // Set the y position of the snake to be lower
    this.energy = 10;
    this.attackDamage = 10;
    this.attackRange = 50;
    this.speed = 0.5;
    this.offset = { top: 60, bottom: 60, left: 50, right: 50 };

    this.IMAGES_WALKING = [
      "img/snake/walk/Walk1.png",
      "img/snake/walk/Walk2.png",
      "img/snake/walk/Walk3.png",
      "img/snake/walk/Walk4.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/snake/attack/attack 000.png",
      "img/snake/attack/attack 001.png",
      "img/snake/attack/attack 002.png",
      "img/snake/attack/attack 003.png",
    ];
    this.IMAGES_HURT = ["img/snake/hurt/hurt 000.png", "img/snake/hurt/hurt 001.png"];
    this.IMAGES_DEAD = [
      "img/snake/die/die 000.png",
      "img/snake/die/die 001.png",
      "img/snake/die/die 002.png",
      "img/snake/die/die 003.png",
    ];

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  handleMovement() {
    if (!this.dead && this.isMoving) {
      this.moveLeft();
    }
  }
}