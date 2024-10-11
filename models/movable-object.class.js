class MovableObject {
  x = 120;
  y = 400;
  img;
  height = 260; // Höhe des Bildes
  width = 110; // Breite des Bildes
  drawRectangle = true; // Standardmäßig kein Rechteck
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
 
    // Offsets für das Rechteck
    offset = {
      top: 0,     // Wie viel kleiner das Rechteck von oben sein soll
      bottom: 0,  // Wie viel kleiner das Rechteck von unten sein soll
      left:0,    // Wie viel kleiner das Rechteck von links sein soll
      right: 0    // Wie viel kleiner das Rechteck von rechts sein soll
    };

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
    this.img.src = path
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  // Angepasste drawFrame Methode
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
  playAnimation(images){
    let i = this.currentImage % this.IMAGES_WALKING.length; // Auf das übergebene Array zugreifen
    let path = images[i]; // Bildpfad aus dem Array
    this.img = this.imageCache[path]; // Bild aus dem Cache setzen
    this.currentImage++;
  }
  moveRight() {
    this.x += this.speed;
     
    this.walking_sound.play();
  }
  moveLeft(){ 
    this.x -= this.speed;
    
     setInterval(() => {
    }, 1000 / 60);
  }
 jump() {
  this.speedY = 30;
 }
}

