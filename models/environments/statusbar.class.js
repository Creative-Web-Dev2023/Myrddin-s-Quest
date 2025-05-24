class StatusBar extends MovableObject {
  percentage = 100;
  constructor(type, x, y, width, height, label) {
    super();
    this.type = type;
    this.imageSet = LOADED_IMAGES.gameUI.status_bars[type];
    this.addToImageCache(type, this.imageSet);
    this.img = this.imageSet[0];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = this.imageSet[this.resolveImageIndex()];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  drawLabel(ctx) {
    if (!this.label) return;
    ctx.font = '22px MedievalSharp';
    ctx.fillStyle = '#821f09';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(this.label, this.x + 5, this.y + 10);
  }
}