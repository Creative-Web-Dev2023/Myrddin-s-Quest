/**
 * Class representing a cloud object.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  height = 200;
  width = 600;
  speed = 0.2;

  /**
   * Creates an instance of Cloud.
   * @param {number} initialX - The initial x position of the cloud.
   */
  constructor(initialX = Math.random() * 2600) {
    super().loadImage("img/clouds/full.png");
    this.x = initialX;
    this.y = Math.random() * 50;
    this.animate();
  }

  /**
   * Animates the cloud by moving it to the left.
   */
  animate() {
    this.moveLeft();
  }

  /**
   * Moves the cloud to the left.
   */
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

/**
 * Class representing a collection of clouds.
 */
class Clouds {
  /**
   * Creates an instance of Clouds.
   * @param {Cloud[]} clouds - An array of Cloud objects.
   */
  constructor(clouds) {
    this.clouds = clouds;
  }

  /**
   * Randomizes the positions of the clouds.
   * @param {number} [totalLength=2600] - The total length of the area where clouds are positioned.
   */
  randomizePositions(totalLength = 2600) {
    const cloudCount = this.clouds.length;
    const spacing = totalLength / cloudCount;
    this.clouds.forEach((cloud, index) => {
      cloud.x = index * spacing + Math.random() * spacing;
      cloud.y = Math.random() * 50;
    });
  }
}
