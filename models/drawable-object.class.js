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
    left:0,    // Wie viel kleiner das Rechteck von links sein soll
    right: 0    // Wie viel kleiner das Rechteck von rechts sein soll
};


   //loadImage ('img/test.png');
   loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path;
  }
  draw(ctx) {
    if (this.img) { // Überprüfen, ob das Bild geladen ist
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  } else {
    console.warn(`Image not loaded for object at (${this.x}, ${this.y})`);
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
        arr.forEach((path) => {
          let img = new Image();
          img.src = path;
          this.imageCache[path] = img;
        });
      }
}
