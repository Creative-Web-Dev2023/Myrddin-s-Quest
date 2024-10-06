class MovableObject {
  x = 100;
  y = 250;
  img;
  height = 120;
  width = 240;
   drawRectangle = true; // Standardmäßig kein Rechteck
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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    if (this.drawRectangle) { // Überprüfen, ob das Rechteck gezeichnet werden soll
      this.drawFrame(ctx);
    }
  }
  

  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'blue';
    const frameWidth = this.width * 0.3;  // 90% der Breite
    const frameHeight = this.height * 0.89; // 85% der Höhe
    const xOffset = (this.width - frameWidth) / 2; // zentrieren
    const yOffset = (this.height - frameHeight) / 2; // zentrieren
    ctx.rect(
        this.x + xOffset, // Linke obere Ecke X
        this.y + yOffset, // Linke obere Ecke Y
        frameWidth,       // Angepasste Breite
        frameHeight       // Angepasste Höhe
    );
    ctx.stroke();
    ctx.closePath();
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
  this.speedY =30;
 }
}

