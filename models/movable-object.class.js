class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 280;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;

  applyGravity() {
    setInterval(() => {
      if ( this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } 
    }, 1000 / 25);
  }
 isAboveGround() {
    return this.y < 150;
  }
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
  playAnimation(images){
    let i = this.currentImage % this.IMAGES_WALKING.length; // Auf das übergebene Array zugreifen
    let path = images[i]; // Bildpfad aus dem Array
    this.img = this.imageCache[path]; // Bild aus dem Cache setzen
    this.currentImage++;
  }
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;    
    this.walking_sound.play();
  }

  moveLeft(){ 
    this.x -= this.speed;
    this.otherDirection = true;
    setInterval(() => {
   }, 1000 / 60);
  }
 
 jump() {
  this.speedY =30;
 }
}

