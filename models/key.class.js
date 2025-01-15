class Key extends DrawableObject {
  IMAGES_KEY = [
    'img/game_items/key.png'
  ];

  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_KEY[0]);
    this.loadImages(this.IMAGES_KEY);
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.isActive = true;
    this.opacity = 1.0;
  }

  deactivate() {
    this.fadeOut();
  }

  fadeOut() {
    const fadeInterval = setInterval(() => {
      this.opacity -= 0.2;
      if (this.opacity <= 0) {
        clearInterval(fadeInterval);
        this.isActive = false;
      }
    }, 50);
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }

}
