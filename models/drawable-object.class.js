class DrawableObject {
  constructor(x = 0, y = 0, width = 100, height = 100) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = new Image();
      this.imageCache = {};
      this.currentImage = 0;
      this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  loadImage(path) {
      this.img.src = path;
  }

  loadImages(images) {
      images.forEach(path => {
          const img = new Image();
          img.src = path;
          this.imageCache[path] = img;
      });
  }

  playAnimation(images) {
      if (!images?.length) return;
      this.img = this.imageCache[images[this.currentImage % images.length]];
      this.currentImage++;
  }

  draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  getCollisionBox() {
      return {
          x: this.x + this.offset.left, y: this.y + this.offset.top,
          width: this.width - this.offset.left - this.offset.right,
          height: this.height - this.offset.top - this.offset.bottom
      };
  }
}
