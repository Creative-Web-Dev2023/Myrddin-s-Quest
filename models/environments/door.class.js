/**
 * Class representing a door object.
 * @extends MovableObject
 */
class Door extends MovableObject {
  /**
   * Creates an instance of Door.
   * @param {number} x - The x position of the door.
   * @param {number} y - The y position of the door.
   * @param {string} id - The id of the door.
   */
  constructor(x, y) {
    super();
    this.loadImage(LOADED_IMAGES.game_items.door[0]);
    this.addToImageCache('door', LOADED_IMAGES.game_items.door);
    console.log('[Door] ImageCache:', this.imageCache);
    this.x = x;
    this.y = y;
    this.width = 300;
    this.height = 460;
    this.offset = { top: 50, bottom: 100, left: 120, right: 120 };
    this.img = this.imageCache['door_0'];
    this.animate();
  }

  /**
   * Loads images into the image cache.
   * @param {string[]} images - The array of image sources.
   */
  /*   loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img;
    });
  } */

  /**
   * Animates the door by cycling through images.
   */
  /*   animate() {
    let currentImageIndex = 0;
    setInterval(() => {
      // this.img = this.imageCache[LOADED_IMAGES.game_items.door[currentImageIndex]];
      this.img = this.imageCache[`door_${currentImageIndex}`];
      currentImageIndex =
        (currentImageIndex + 1) % LOADED_IMAGES.game_items.door.length;
    }, 1000 / 4);
  } */

  /*     animate() {
      setInterval(() => {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % LOADED_IMAGES.game_items.door.length;
        this.img = this.imageCache[`door_${this.currentImageIndex}`];
      }, 1000 / 4);
    } */

  animate() {
    this.playAnimation(LOADED_IMAGES.game_items.door);
  }

  /**
   * Draws the door on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  /*   draw(ctx) {
    super.draw(ctx);
  } */

  draw(ctx) {
    console.log('[DRAW DOOR] wird aufgerufen bei x =', this.x);
    super.draw(ctx);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
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
      this.img = this.imageCache[`door_${doorOpenFrame}`];
      doorOpenFrame++;
      if (doorOpenFrame >= LOADED_IMAGES.game_items.door.length)
        clearInterval(openInterval);
    }, 100);
  }
}