class MovableObject extends DrawableObject {
  drawRectangle = true; 
  speed = 0.15; 
  speedY = 0; 
  acceleration = 2.5; 
  energy = 100; 
  lastHit = 0; 
  currentImage = 0;
  lastFrame = 0;

  offset = {
      top: 0,     
      bottom: 0,  
      left: 0,   
      right: 0   
  };

  applyGravity() { 
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) { 
        this.y -= this.speedY; 
        this.speedY -= this.acceleration; 
      } else {
        this.speedY = 0; 
      }
    }, 1000 / 25); 
  }

  isAboveGround() { 
    if(this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150; 
    }
  }
  
  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false; 
    return (
        this.x + this.width > mo.x &&
        this.x < mo.x + mo.width &&
        this.y + this.height > mo.y &&
        this.y < mo.y + mo.height
    );
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };
  }
 
  isHurt() { 
    let timepassed = new Date().getTime() - this.lastHit; 
    timepassed = timepassed / 1000;  
    return timepassed < 5;
  }

  isDead() {
    return this.energy <= 0;
  }

  playAnimation(images, delay = 100) { 
    if (images && images.length > 0) { 
      let i = this.currentImage % images.length; 
      let path = images[i];
      this.img = this.imageCache[path]; 
      this.currentImage++;
      if (this.currentImage >= images.length) { 
        this.currentImage = 0; 
      }
    }
    setTimeout(() => {}, delay);
  }

  loadImages(images) { 
    if (!images || !Array.isArray(images) || images.length === 0) { 
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
  
  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
      this.energy -= damage;
      this.playAnimation(this.IMAGES_HURT);
      if (this.energy <= 0) {
        this.energy = 0;
        this.die();
      } else {
        this.invulnerable = true;
        setTimeout(() => {
          this.invulnerable = false;
        }, 2000);
      }
    }
  }

  die() {
    if (!this.deadAnimationPlayed) {
      this.deadAnimationPlayed = true;
      this.playAnimation(this.IMAGES_DEAD); 
      setTimeout(() => {
        this.isVisible = false; 
      }, 3000);
    }
  }

  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
    setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const thisBox = this.getCollisionBox();
      const isStillInRange =
        thisBox.x < characterBox.x + characterBox.width &&
        thisBox.x + thisBox.width > characterBox.x &&
        thisBox.y < characterBox.y + characterBox.height &&
        thisBox.y + thisBox.height > characterBox.y;
      if (isStillInRange) {
        character.takeDamage(this.attackDamage);
      }
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }, 400);
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) { 
        this.handleDeadAnimation(); 
      } else if (this.world && this.world.board && this.world.keyboard.ATTACK) {
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
    }, 100); 
  }

  playAnimationWithSound(images, sound) { 
    this.playAnimation(images);
    if (musicIsOn) {
      if (sound.paused) { 
        sound.play(); 
      }
    } else {
      sound.pause(); 
      sound.currentTime = 0; 
    }
  }

  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    if (this.currentImage >= this.IMAGES_DEAD.length - 1) { 
      clearInterval(this.animationInterval); 
      clearInterval(this.movementInterval); 
      clearInterval(this.attackAnimationInterval);
      setTimeout(() => {
        if (this.world.endGame) { 
          this.world.endGame.showYouLostScreen(); 
        }
      }, 3500); 
    }
  }

  playAnimation(images) {
    if (this.isDead()) return;
    
    if(this.currentImage % images.length === 0 || Date.now() - this.lastFrame > 100) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
        this.lastFrame = Date.now();
    }
  }
}