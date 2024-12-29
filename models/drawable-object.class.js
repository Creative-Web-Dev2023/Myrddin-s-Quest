class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
    this.img = this.imageCache[images[0]]; // Set the initial image
  }

  playAnimation(images) {
    if (images && images.length > 0) { // Ensure images is an array and has a length property
      let i = this.currentImage % images.length;
      this.img = this.imageCache[images[i]];
      this.currentImage++;
    } else {
      console.error('Images array is not defined or empty');
    }
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this.frame) {
      ctx.beginPath();
      ctx.lineWidth = '4';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  drawCollisionBox(ctx, color = 'red') {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = color;
    ctx.rect(this.x, this.y, this.width, this.height); // Kollisionsbox zeichnen
    ctx.stroke();
  }
}