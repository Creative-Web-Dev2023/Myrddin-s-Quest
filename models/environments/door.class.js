class Door extends MovableObject {
  offset = { top: 50, bottom: 100, left: 120, right: 120 };
  constructor() {
    super();
    this.addToImageCache('door', LOADED_IMAGES.game_items.door);
    this.img = this.imageCache['door_0'];
    this.x = 6300;
    this.y = 130;
    this.width = 460;
    this.height = 460;

    this.img = this.imageCache['door_0'];
    this.drawFrame();
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