class DrawableObject {
  x = 120;  
  y = 400;
  img;
  imageCache = {};
  currentImage = 0;
  height = 260; // Höhe des Bildes
  width = 110; // Breite des Bildes
  offset = {
    top: 0,     // Wie viel kleiner das Rechteck von oben sein soll
    bottom: 0,  // Wie viel kleiner das Rechteck von unten sein soll
    left: 0,    // Wie viel kleiner das Rechteck von links sein soll
    right: 0    // Wie viel kleiner das Rechteck von rechts sein soll
  };

  loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path;
  }

draw(ctx) {
  if (this.img && this.img.complete && ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Knight || this instanceof Endboss) {
      this.drawRectangle = true;
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(
          this.x + this.offset.left,
          this.y + this.offset.top,
          this.width - this.offset.left - this.offset.right,
          this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  loadImages(arr) {
    if (!Array.isArray(arr)) {
        return;
    }
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 0 % 6; => 0, Rest 0
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  checkCollision(object) {
    const hitbox = {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };

    return (
      hitbox.x < object.x + object.width &&
      hitbox.x + hitbox.width > object.x &&
      hitbox.y < object.y + object.height &&
      hitbox.y + hitbox.height > object.y
    );
  }

  isCollidingWith(object) {
    return this.checkCollision(object);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.calculateImageIndex()];
    this.img = this.imageCache[path];
  }

  calculateImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    }
    if (this.percentage >= 80) {
      return 4;
    }
    if (this.percentage >= 60) {
      return 3;
    }
    if (this.percentage >= 40) {
      return 2;
    }
    if (this.percentage >= 20) {
      return 1;
    }
    return 0;
  }
}