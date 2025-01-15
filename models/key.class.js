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
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 }; // Setze Offsets
  }

  deactivate() {
    this.isActive = false; // Setze isActive auf false
    this.fadeOut();
  }

  fadeOut() {
    const fadeInterval = setInterval(() => {
      this.opacity -= 0.2;
      if (this.opacity <= 0) {
        clearInterval(fadeInterval);
      }
    }, 50);
  }

  draw(ctx) {
    if (this.isActive || this.opacity > 0) { // Zeichne nur, wenn isActive oder opacity > 0
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };
  }
}
