/**
 * Class representing a door object.
 * @extends MovableObject
 */
class Door extends MovableObject {
  IMAGE_DOOR = [
    "img/door/door 0.png",
    "img/door/door 1.png",
    "img/door/door 2.png",
    "img/door/door 3.png",
    "img/door/door 4.png",
  ];

  /**
   * Creates an instance of Door.
   * @param {number} x - The x position of the door.
   * @param {number} y - The y position of the door.
   * @param {string} id - The id of the door.
   */
  constructor(x, y, id) {
    super();
    this.id = id;
    this.imageCache = {};
    this.loadImages(this.IMAGE_DOOR);
    this.x = 4500;
    this.y = y;
    this.width = 300;
    this.height = 460;
    this.offset = { top: 0, bottom: 250, left: 200, right: 200 };
    this.img = this.imageCache[this.IMAGE_DOOR[0]];
    this.animate();
  }

  /**
   * Loads images into the image cache.
   * @param {string[]} images - The array of image sources.
   */
  loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img;
    });
  }

  /**
   * Animates the door by cycling through images.
   */
  animate() {
    let currentImageIndex = 0;
    setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[currentImageIndex]];
      currentImageIndex = (currentImageIndex + 1) % this.IMAGE_DOOR.length;
    }, 1000 / 4);
  }

  /**
   * Draws the door on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    this.drawFrame(ctx);
  }

  /**
   * Checks if the door is colliding with a character.
   * @param {Character} character - The character to check collision with.
   * @returns {boolean} True if colliding, false otherwise.
   */
  isCollidingWithDoor(character) {
    const box1 = this.getCollisionBox();
    const box2 = character.getCollisionBox();
    const isColliding =
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y;

    return isColliding;
  }

  /**
   * Allows a character to enter the door.
   * @param {Character} character - The character entering the door.
   */
  enterDoor(character) {
    character.enterDoor(this);
  }

  /**
   * Animates the door opening.
   */
  animateOpening() {
    let doorOpenFrame = 0;
    const openInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[doorOpenFrame]];
      doorOpenFrame++;
      if (doorOpenFrame >= this.IMAGE_DOOR.length) clearInterval(openInterval);
    }, 100);
  }

  /**
   * Draws the door in the world.
   * @param {World} world - The world object containing the door.
   */
  static drawDoor(world) {
    if (world.door) {
      world.door.drawFrame(world.ctx);
    }
  }
}
