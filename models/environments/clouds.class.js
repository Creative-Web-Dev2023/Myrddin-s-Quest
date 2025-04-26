/**
 * Class managing a collection of clouds.
 */
class Clouds {
  /**
   * Creates an instance of Clouds.
   * @param {Cloud[]} clouds - An array of Cloud objects.
   */
  constructor(clouds = []) {
    this.clouds = clouds;
  }

  /**
   * Distributes clouds evenly across a given total length.
   * @param {number} [totalLength=2600]
   */
  randomizePositions(totalLength = 2600) {
    const count = this.clouds.length;
    const spacing = totalLength / count;
    this.clouds.forEach((cloud, index) => {
      cloud.x = index * spacing + Math.random() * spacing;
      cloud.y = Math.random() * 50;
    });
  }

  /**
   * Periodically adds new clouds.
   * @param {number} interval - Interval in milliseconds.
   */
  startGeneratingClouds(interval = 5000) {
    setInterval(() => {
      const newCloud = new Cloud(2600 + Math.random() * 500);
      this.clouds.push(newCloud);
    }, interval);
  }

  /**
   * Updates all clouds: moves them and removes those out of view.
   */
  updateClouds() {
    this.clouds.forEach((cloud) => cloud.updatePosition());
    this.clouds = this.clouds.filter((cloud) => cloud.x + cloud.width > 0);
  }
}