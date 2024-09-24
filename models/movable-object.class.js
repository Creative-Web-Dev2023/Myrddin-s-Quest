class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 280;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
 

  //loadImage ('img/test.png');
  loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path;
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
  moveRight() {
    console.log("Moving right");
  }

  moveLeft(){ 
    setInterval(() =>{
        this.x -= this.speed//  die X-Koordinate wird um 0.15 nach links verschoben
    }, 1000 / 60); // 60x pro Sekunde
 }   
}
