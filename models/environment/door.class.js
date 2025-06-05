/**
 * Represents a door object in the game environment.
 * @extends MovableObject
 */
class Door extends MovableObject {
  /**
   * The hitbox offset for the door object.
   */
  offset = { top: 120, bottom: 100, left: 200, right: 200 };
  img;
  x;
  y;
  width;
  height;
  message;
  messageTimestamp;
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
   */
  open(afterAnimation) {
    this.playAnimationOnce(LOADED_IMAGES.game_items.door, afterAnimation);
  }

  /**
   * Shows a message above the door for a short time.
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
