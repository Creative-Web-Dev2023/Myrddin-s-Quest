class Door extends MovableObject {
  offset = { top: 120, bottom: 100, left: 200, right: 200 };
  constructor() {
    super();
    this.addToImageCache('door', LOADED_IMAGES.game_items.door);
    this.img = this.imageCache['door_0'];
    this.x = 6300;
    this.y = 130;
    this.width = 460;
    this.height = 460;

    this.message = null;
    this.messageTimestamp = 0;
    this.isMessageActive = false;

    this.img = this.imageCache['door_0'];
    this.drawFrame();
  }

  open(afterAnimation) {
    this.playAnimationOnce(LOADED_IMAGES.game_items.door, afterAnimation);
  }

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

  drawMessage(ctx) {
    if (!this.message) return;

    ctx.font = '32px MedievalSharp';
    ctx.fillStyle = '#ff0032';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.message, this.x + this.width / 2 + 50, this.y - 10);
  }

  drawFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}