class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;
  offset = { top: 0, bottom: 0, left: 0, right: 0 }; // Initialize offset

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
    if (this instanceof Character || this instanceof Knight || this instanceof Endboss || this instanceof Snake || this instanceof Door || this instanceof PoisonObject) {
      ctx.beginPath();
      ctx.lineWidth = '4';
      if (this instanceof Character) {
        ctx.strokeStyle = 'blue';
      } else if (this instanceof Knight) {
        ctx.strokeStyle = 'red';
      } else if (this instanceof Endboss) {
        ctx.strokeStyle = 'yellow';
      } else if (this instanceof Snake) {
        ctx.strokeStyle = 'beige';
      } else if (this instanceof Door) {
        ctx.strokeStyle = 'green';
      }else if (this instanceof PoisonObject) {
        ctx.strokeStyle = 'black';
      }
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
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
      x: this.x + this.offset.left,// X and Y position plus offset values from all sides of the rectangle
      y: this.y + this.offset.top, // X and Y position plus offset values from all sides of the rectangle
      width: this.width - this.offset.left - this.offset.right, // Width and height minus offset values from all sides of the rectangle
      height: this.height - this.offset.top - this.offset.bottom // Width and height minus offset values from all sides of the rectangle
    };
  }

  drawCollisionBox(ctx) {
    ctx.beginPath();// 
    ctx.rect(this.x, this.y, this.width, this.height); // Kollisionsbox zeichnen
    ctx.stroke();// in english stroke means was the outline of the shape
  }
}