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
    this.gravityInterval = setInterval(() => {
      if ( this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround(){
    if(this instanceof ThrowableObject){ 
      return true;
    }else{
      return this.y < 150;
    }
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Knight || this instanceof Endboss || this instanceof Snake || this instanceof PoisonObject || this instanceof Door) {
      this.drawRectangle = true;
      ctx.beginPath();
      ctx.lineWidth = '5';
      if (this instanceof Character) {
        //funktioniert 
        ctx.strokeStyle = 'blue';  // Farbe für den Charakter
      } else if (this instanceof Knight) {
        //funtioniert 
        ctx.strokeStyle = 'red';  // Farbe für den Ritter
      } else if (this instanceof Door) {
        //funktioniert nicht drawable object.class.js
        ctx.strokeStyle = 'yellow';  // Farbe für die Tür
      } else {
        //Snake und Endboss
        ctx.strokeStyle = 'green';  // Farbe für andere Objekte
      }
      ctx.rect(  // Rechteck wird um die Offsets kleiner gezeichnet
          this.x + this.offset.left,
          this.y + this.offset.top,
          this.width - this.offset.left - this.offset.right, // breite-Offest links und rechts
          this.height - this.offset.top - this.offset.bottom // höhe-Offset oben und unten
      );
      ctx.stroke();
    }
  }

  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false; // Überprüfen, ob mo eine Instanz von MovableObject ist
    const box1 = this.getCollisionBox();
    const box2 = mo.getCollisionBox();
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }

  getCollisionBox() {
    const box = {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
    return box;
  }

  isHurt(){
   let timepassed = new Date().getTime() - this.lastHit;
   timepassed = timepassed / 1000;
   return timepassed < 5;
  }

  isDead(){
    return this.energy == 0;
  }

  playAnimation(images, delay = 100) {
    if (images && images.length > 0) { // Überprüfen, ob das Array definiert und nicht leer ist
      let i = this.currentImage % images.length; // Auf das übergebene Array zugreifen
      let path = images[i]; // Bildpfad aus dem Array
      this.img = this.imageCache[path]; // Bild aus dem Cache setzen
      this.currentImage++;
      if (this.currentImage >= images.length) { 
        this.currentImage = 0; // Setze auf den ersten Frame zurück
      }
    }
    setTimeout(() => {}, delay); // Verzögerung zwischen den Frames
  }
  
  loadImages(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.error('Invalid images array:', images);
      return;
    }
    this.imageCache = this.imageCache || {};
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    this.x += this.speed;
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.walking_sound && this.walking_sound.paused) {
      this.walking_sound.play();
    }
  }

  jump() {
    this.speedY = 30;
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.handleDeadAnimation();
      } else if (this.world && this.world.keyboard && this.world.keyboard.THROW) {
        this.playAnimationWithSound(this.IMAGES_FIRE_ATTACK, fireAttackSound);
      } else if (this.world && this.world.keyboard && this.world.keyboard.ATTACK) {
        this.playAnimationWithSound(this.IMAGES_ATTACK, attackSound);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimationWithSound(this.IMAGES_WALKING, walkingSound);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  playAnimationWithSound(images, sound) {
    this.playAnimation(images);
    if (musicIsOn) { // Nur abspielen, wenn Musik eingeschaltet ist
        if (sound.paused) {
            sound.play();
        }
    } else {
        sound.pause(); // Pausieren, wenn Musik aus ist
        sound.currentTime = 0; // Zurücksetzen auf Anfang
    }
}


  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
      clearInterval(this.animationInterval); // Stop animation only after the death animation is complete
      setTimeout(() => {
        if (this.world.endGame) {
          this.world.endGame.showYouLostScreen(); // Verwenden Sie die Methode aus der EndGame-Klasse
        }
      }, 3500); // Verzögerung von 500 ms, bevor das Overlay angezeigt wird
    }
  }
}
