class PoisonObject extends MovableObject {
  IMAGES_POISON = [
    'img/poison/1.png',
    'img/poison/2.png',
    'img/poison/3.png',
    'img/poison/4.png',
    'img/poison/5.png',
    'img/poison/6.png',
    'img/poison/7.png',
    'img/poison/8.png',
  ];

  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImages(this.IMAGES_POISON);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_POISON);
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }
}
