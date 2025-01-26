class Cloud extends MovableObject {
  height = 200;
  width = 600;
  speed = 0.2;

  constructor(initialX = Math.random() * 2600) {
    super().loadImage("img/clouds/full.png");
    this.x = initialX;
    this.y = Math.random() * 50;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }

  moveLeft() {
    const animate = () => {
      this.x -= this.speed;
      if (this.x + this.width < 0) {
        this.x = 2600 + Math.random() * 500;
        this.y = Math.random() * 50;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
}
class Clouds {
  constructor(clouds) {
    this.clouds = clouds;
  }

  randomizePositions(totalLength = 2600) {
    const cloudCount = this.clouds.length;
    const spacing = totalLength / cloudCount;

    this.clouds.forEach((cloud, index) => {
      cloud.x = index * spacing + Math.random() * spacing;
      cloud.y = Math.random() * 50;
    });
  }
}
