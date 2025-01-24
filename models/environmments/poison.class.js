class PoisonObject extends DrawableObject {
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

  static initializePoisons() {
    const poisons = [
      new PoisonObject(800, 400, 50, 50), 
      new PoisonObject(1600, 300,  50, 50), 
      new PoisonObject(2400, 200, 50, 50), 
      new PoisonObject(3200, 400,  50, 50), 
      new PoisonObject(4000, 300,  50, 50), 
    ];
 
    return poisons;
  }

  deactivate() {
    this.isActive = false;
    this.x = -1000; 
  }

  drawPoisons(ctx, camera_x) {
    if (this.isActive && this.img) {
      ctx.drawImage(this.img, this.x + camera_x, this.y, this.width, this.height);
    }
  }


  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_POISON);
    }, 100); 
  }

}
