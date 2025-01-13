class Trap extends MovableObject {
  height = 100;
  width = 100;
  isActive = false; // Status der Falle
  IMAGES_IDLE = [
    "img/obstacles/trap/trap1.png",
    "img/obstacles/trap/trap2.png",
    "img/obstacles/trap/trap3.png",
    "img/obstacles/trap/trap4.png",
    "img/obstacles/trap/trap5.png",
    "img/obstacles/trap/trap6.png",
  ];

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.animate();
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_IDLE);
    }, 100);
  }

  static drawTraps(ctx, traps) {
    traps.forEach(trap => {
      trap.draw(ctx); // Ensure the trap has a draw method
    });
  }
}
