class Key extends MovableObject {
  offset = { top: 10, bottom: 10, left: 10, right: 10 };
  constructor(x = null, y = 130) {
    super();
    this.img = LOADED_IMAGES.game_items.key;
    this.x = x !== null ? x : 200 + Math.floor(Math.random() * 5000);
    this.y = y;
    this.startY = this.y;
    this.width = 70;
    this.height = 70;
    this.floatAmplitude = 20;
    this.floatSpeed = 2;
    this.floatOffset = 0;

    this.pingSound = LOADED_SOUNDS.key.collected;
    this.pingSound.volume = 0.5;
  }

    drawFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}