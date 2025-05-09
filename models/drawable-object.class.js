class DrawableObject {
  constructor(x = 0, y = 0, width = 100, height = 100) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = null;
    this.imageCache = {};
    this.currentImage = 0;
    this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  isValidImage(img) {
    return img instanceof HTMLImageElement && img.complete;
  }

  loadImage(image) {
    if (this.isValidImage(image)) {
      this.img = image;
    } else {
      console.error("[DrawableObject] Invalid image:", image);
    }
  }

  addToImageCache(prefix, images) {
    if (!Array.isArray(images)) return;

    images.forEach((img, index) => {
      if (this.isValidImage(img)) {
        this.imageCache[`${prefix}_${index}`] = img;
      } else {
        console.warn(
          `[DrawableObject] Unloaded image (${prefix}_${index}):`,
          img
        );
      }
    });
  }

  playAnimation(images) {
    if (!images) {
      // Keine Animation möglich, wenn undefined oder null
      return;
    }
    if (!Array.isArray(images)) {
      console.error(
        `[DrawableObject] Ungültiges Bildarray für ${this.constructor.name}:`,
        images
      );
      return;
    }
    if (images.length === 0) {
      console.warn(
        `[DrawableObject] Leeres Bildarray für ${this.constructor.name}.`
      );
      return;
    }

    this.img = images[this.currentImage % images.length];
    this.currentImage++;
  }

  draw(ctx) {
    if (this.isValidImage(this.img)) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
      console.warn(
        `[DrawableObject] Image not ready for ${this.constructor.name}`
      );
    }
  }

  get effectiveWidth() {
    return this.width - this.offset.left - this.offset.right;

  }

  get effectiveHeight() {
    return this.height - this.offset.top - this.offset.bottom;
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.effectiveWidth,
      height: this.effectiveHeight,
    };
  }
}
