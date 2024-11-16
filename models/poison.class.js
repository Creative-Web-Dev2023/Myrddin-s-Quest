class PoisonObject extends MovableObject {
  IMAGES_POISON = [
    "img/poison/1.png",
    "img/poison/2.png",
    "img/poison/3.png",
    "img/poison/4.png",
    "img/poison/5.png",
    "img/poison/6.png",
    "img/poison/7.png",
    "img/poison/8.png",
  ];

  isActive = true;

  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImages(this.IMAGES_POISON);
    this.animate();
  }

  deactivate() {
    this.isActive = false;
    this.x = -1000; // Bewege das Objekt aus dem sichtbaren Bereich
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_POISON);
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  draw(ctx, camera_x) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x + camera_x, this.y, this.width, this.height);
    }
  }

  drawCollisionBox(ctx, camera_x) {
    if (this.isActive) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(this.x + camera_x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
