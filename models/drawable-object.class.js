class DrawableObject {
  x = 120;  // 
  y = 400;
  img;
  imageCache = {};
  currentImage = 0;
  height = 260; // Höhe des Bildes
  width = 110; // Breite des Bildes
  offset = {
    top: 0,     // Wie viel kleiner das Rechteck von oben sein soll
    bottom: 0,  // Wie viel kleiner das Rechteck von unten sein soll
    left:0,    // Wie viel kleiner das Rechteck von links sein soll
    right: 0    // Wie viel kleiner das Rechteck von rechts sein soll
};


   //loadImage ('img/test.png');
   loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path;
    this.img.onload = () => {
        console.log(`Image loaded: ${path}`);
    };
    this.img.onerror = () => {
        console.error(`Failed to load image: ${path}`);
    };
    }
    draw(ctx) {
    if (this.img && ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
        console.error('Image or context is not defined');
    }
}

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Knight || this instanceof Endboss) {
      this.drawRectangle = true;
      ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'blue';
    ctx.rect(  // Rechteck wird um die Offsets kleiner gezeichnet
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right, // breite-Offest links und rechts
        this.height - this.offset.top - this.offset.bottom // höhe-Offset oben und unten
      );
      ctx.stroke();
    }
  }
    /**
   *
   * @param {Array} arr -['img/wizard/walk/walk_001.png',
   *                      'img/wizard/walk/walk_002.png',
   *                      'img/wizard/walk/walk_003.png',
   *                      'img/wizard/walk/walk_004.png',
   *                      'img/wizard/walk/walk_005.png',
   *                      'img/wizard/walk/walk_006.png',
   *                      'img/wizard/walk/walk_007.png',
   *                      'img/wizard/walk/walk_008.png',
   *                      'img/wizard/walk/walk_009.png',]
   */
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
}
