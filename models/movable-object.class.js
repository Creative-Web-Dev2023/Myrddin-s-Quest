class MovableObject extends DrawableObject {
  drawRectangle = true; // Standardmäßig kein Rechteck
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  currentImage = 0;

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
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Knight || this instanceof Endboss || this instanceof Snake || this instanceof PoisonObject) {
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
  // character.isColliding(knight)
  isColliding(mo) {
    return this.x + this.width > mo.x && //Rechteck Kollision
           this.x < mo.x + mo.width &&  
           this.y + this.height > mo.y &&
           this.y < mo.y + mo.height;
  }

  isHurt(){
   let timepassed = new Date().getTime() - this.lastHit;
   timepassed = timepassed / 1000;
   return timepassed < 5;
  }
  isDead(){
    return this.energy == 0;
  }

  playAnimation(images){
    let i = this.currentImage % images.length; // Auf das übergebene Array zugreifen
    let path = images[i]; // Bildpfad aus dem Array
    this.img = this.imageCache[path]; // Bild aus dem Cache setzen
    this.currentImage++;
    if (this.currentImage >= images.length) { // 
      this.currentImage = 0; // Setze auf den ersten Frame zurück
    }
  }
  
  moveRight() {
    this.x += this.speed;
    if (this.walking_sound) {
      this.walking_sound.play();
    }
  }
  moveLeft() {
    this.x -= this.speed;
    if (this.walking_sound) {
      this.walking_sound.play();
    }
  }
  jump() {
    this.speedY = 30;
  }
}
