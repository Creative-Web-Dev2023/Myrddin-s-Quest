class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    if (arr && Array.isArray(arr)) {
      arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
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

  getCollisionBox(type) {
    return {
      type: type,
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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this.drawRectangle) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}