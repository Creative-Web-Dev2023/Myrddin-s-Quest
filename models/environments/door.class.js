/**
 * Represents a door object in the game environment.
 * @extends MovableObject
 */
class Door extends MovableObject {
  /**
   * The hitbox offset for the door object.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  offset = { top: 120, bottom: 100, left: 200, right: 200 };

  /**
   * The image of the door.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * The X position of the door.
   * @type {number}
   */
  x;

  /**
   * The Y position of the door.
   * @type {number}
   */
  y;

  /**
   * The width of the door.
   * @type {number}
   */
  width;

  /**
   * The height of the door.
   * @type {number}
   */
  height;

  /**
   * The message to display above the door.
   * @type {string|null}
   */
  message;

  /**
   * The timestamp when the message was set.
   * @type {number}
   */
  messageTimestamp;

  /**
   * Whether a message is currently active.
   * @type {boolean}
   */
  isMessageActive;

  /**
   * Creates a new Door instance.
   */
  constructor() {
    super();
    this.addToImageCache("door", LOADED_IMAGES.game_items.door);
    this.img = this.imageCache["door_0"];
    this.x = 6300;
    this.y = 130;
    this.width = 460;
    this.height = 460;
    this.message = null;
    this.messageTimestamp = 0;
    this.isMessageActive = false;

    this.img = this.imageCache["door_0"];
  }

  /**
   * Opens the door and plays the animation.
   * @param {Function} afterAnimation - Callback to execute after the animation.
   */
  open(afterAnimation) {
    this.playAnimationOnce(LOADED_IMAGES.game_items.door, afterAnimation);
  }

  /**
   * Shows a message above the door for a short time.
   * @param {string} text - The message to display.
   */
  showMessage(text) {
    if (this.isMessageActive) return;

    this.message = text;
    this.messageTimestamp = Date.now();
    this.isMessageActive = true;

    setTimeout(() => {
      this.message = null;
      this.isMessageActive = false;
    }, 50);
  }

  /**
   * Draws the message above the door if active.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawMessage(ctx) {
    if (!this.message) return;

    ctx.font = "32px MedievalSharp";
    ctx.fillStyle = "#ff0032";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(this.message, this.x + this.width / 2 + 50, this.y - 10);
  }
}
