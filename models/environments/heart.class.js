class Heart extends MovableObject {
  offset = { top: 0, bottom: 0, left: 0, right: 0 };
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.heart;
    this.x = x;
    this.y = Math.floor(Math.random() * 180) + 50;
    this.startY = this.y;
    this.height = 50;
    this.width = 50;
    this.floatAmplitude = 15;
    this.floatSpeed = 1.5;

    this.collectingSound = LOADED_SOUNDS.heart.collected;
    this.collectingSound.volume = 0.5;
  }

  drawFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}