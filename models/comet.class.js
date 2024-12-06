class Comet extends MovableObject {
  constructor(x, y, images) {
    super();
    this.x = x;
    this.y = y;
    this.loadImages(images);
    this.speed = 5;
    this.playAnimation(images);
  }

  move() {
    this.x -= this.speed;
  }

  animate() {
    setInterval(() => {
      this.move();
    }, 1000 / 30);
  }
}
