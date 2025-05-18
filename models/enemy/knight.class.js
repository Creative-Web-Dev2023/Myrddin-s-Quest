class Knight extends MovableObject {
  offset = { top: 100, bottom: 70, left: 240, right: 100 };
  constructor(x) {
    super();
    this.addToImageCache('walk', LOADED_IMAGES.knight.walk);
    this.img = this.imageCache['walk_0'];
    this.x = x;
    this.y = 250;
    this.speed = 1 + Math.random() * 0.5;
    this.width = 520;
    this.height = 290;
  }

  handleAnimations() {
    this.animate(LOADED_IMAGES.knight.walk);
  }

  drawFrame() {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 2;

    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;

    ctx.strokeRect(offsetX, offsetY, offsetWidth, offsetHeight);
  }
}