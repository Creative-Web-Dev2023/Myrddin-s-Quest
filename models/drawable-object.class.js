class DrawableObject {
  x = 120;
  y = 400;
  img;
  imageCache = {};
  currentImage = 0;
  height = 260; // Höhe des Bildes
  width = 110; // Breite des Bildes

   //loadImage ('img/test.png');
   loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
