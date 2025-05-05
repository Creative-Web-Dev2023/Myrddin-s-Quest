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
    this.currentImage = 0; 
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

 
  animate() {
    setInterval(() => {
      this.playAnimation(LOADED_IMAGES.game_items.door);
    }, 1000 / 4); 
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
  // enterDoor(character) {
  //   character.enterDoor(this);
  // }
}