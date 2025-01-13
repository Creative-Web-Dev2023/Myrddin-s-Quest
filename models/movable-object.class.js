class MovableObject extends DrawableObject {
  drawRectangle = true; // Default is no rectangle
  speed = 0.15; // Default speed 
  speedY = 0; // Vertical speed
  acceleration = 2.5; // Acceleration for gravity
  energy = 100; // Energy for the object
  lastHit = 0; // Time of last hit
  currentImage = 0; // Current image index

  offset = {
      top: 0,     // How much smaller the rectangle should be from the top
      bottom: 0,  // How much smaller the rectangle should be from the bottom
      left: 0,    // How much smaller the rectangle should be from the left
      right: 0    // How much smaller the rectangle should be from the right
  };

  applyGravity() { // Apply gravity effect to the object
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) { // Überprüfe, ob der Charakter über dem Boden ist oder nach oben springt
        this.y -= this.speedY; // Bewege das Objekt nach oben, wenn speedY positiv ist
        this.speedY -= this.acceleration; // Verringere die vertikale Geschwindigkeit
      } else {
        this.y = 150; // Setze die y-Position auf den Boden, wenn das Objekt den Boden erreicht
        this.speedY = 0; // Setze die vertikale Geschwindigkeit zurück
      }
    }, 1000 / 25); // Intervall für die Schwerkraft
  }

  isAboveGround() { // Check if object is above ground 
    return this.y < 150; // Überprüfe, ob die y-Position über 150 ist
  }
  
  isColliding(mo) {
    if (!(mo instanceof MovableObject)) return false; // Prüfen, ob mo ein MovableObject ist
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
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
 
  isHurt() { // Check if object is hurt
    let timepassed = new Date().getTime() - this.lastHit; // Calculate time passed since last hit in milliseconds
    timepassed = timepassed / 1000; // Convert to seconds  
    return timepassed < 5; // Check if hurt within last 5 seconds
  }

  isDead() {
    return this.energy <= 0;
  }

  playAnimation(images, delay = 100) { // Play animation frames for the object
    if (images && images.length > 0) { // Prüfe, ob die Bilder vorhanden sind
      let i = this.currentImage % images.length; // Bestimme das aktuelle Bild
      let path = images[i]; // Hole den Pfad des aktuellen Bildes
      this.img = this.imageCache[path]; // Setze das Bild
      this.currentImage++; // Erhöhe den aktuellen Bildindex
      if (this.currentImage >= images.length) { // Wenn alle Bilder durchlaufen sind
        this.currentImage = 0; // Setze den Index zurück
      }
    }
    setTimeout(() => {}, delay); // Verzögerung zwischen den Frames
  }

  loadImages(images) { // Load images for the object
    if (!images || !Array.isArray(images) || images.length === 0) { // Check for valid images array
      return;
    }
    this.imageCache = this.imageCache || {}; // Initialize image cache
    images.forEach((path) => { // Load the images
      const img = new Image(); // Create a new image
      img.src = path; // Set the image source
      this.imageCache[path] = img; // Cache the image
    });
  }

  moveRight() { // Move right function for the object
    this.x += this.speed; // Move right by speed
    if (this.walking_sound && this.walking_sound.paused) { // Check if walking sound is paused
      this.walking_sound.play(); // Play walking sound if paused
    }
  }

  moveLeft() { // Move left function for the object
    this.x -= this.speed; // Move left by speed
    if (this.walking_sound && this.walking_sound.paused) { // Check if walking sound is paused
      this.walking_sound.play(); // Play walking sound if paused
    }
  }

  jump() { // Jump function for the object 
    this.speedY = 30; // Set vertical speed for jump
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
      this.playAnimation(this.IMAGES_DEAD); // Play dead animation
      setTimeout(() => {
        this.isVisible = false; // Make the object invisible after death
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

  animate() { // Animate the object
    this.animationInterval = setInterval(() => {
      if (this.isDead()) { // Check if object is dead 
        this.handleDeadAnimation(); // Handle dead animation for the object  
      } else if (this.world && this.world.keyboard && this.world.keyboard.THROW) { // Check if object is throwing
        this.playAnimationWithSound(this.IMAGES_FIRE_ATTACK, fireAttackSound); // Play fire attack animation frames with sound
      } else if (this.world && this.world.keyboard && this.world.keyboard.ATTACK) { // Check if object is attacking
        this.playAnimationWithSound(this.IMAGES_ATTACK, attackSound); // Play attack animation frames with sound
      } else if (this.isHurt()) { // Check if object is hurt within last 5 seconds 
        this.playAnimation(this.IMAGES_HURT); // Play hurt animation frames for the object
      } else if (this.isAboveGround()) { // Check if object is above ground
        this.playAnimation(this.IMAGES_JUMPING); // Play jumping animation frames for the object
      } else if (this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimationWithSound(this.IMAGES_WALKING, walkingSound); // Play walking animation frames with sound
      } else {
        this.playAnimation(this.IMAGES_IDLE); // Play idle animation frames for the object
      }
    }, 100); // 100 ms between frames for smooth animation
  }

  playAnimationWithSound(images, sound) { // Play animation frames with sound
    this.playAnimation(images); // Play animation frames for the object
    if (musicIsOn) {
      if (sound.paused) { // Check if sound is paused
        sound.play(); // Play sound if paused
      }
    } else {
      sound.pause(); // Pause sound if music is off
      sound.currentTime = 0; // Reset to start
    }
  }

  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD); // Play dead animation frames for the object  
    if (this.currentImage >= this.IMAGES_DEAD.length - 1) { // Check if last frame is reached
      clearInterval(this.animationInterval); // Stop animation after death animation completes
      clearInterval(this.movementInterval); // Stop movement interval
      clearInterval(this.attackAnimationInterval); // Stop attack animation interval
      setTimeout(() => {
        if (this.world.endGame) { // If endGame is available
          this.world.endGame.showYouLostScreen(); // Show "You Lost" screen
        }
      }, 3500); // Delay before showing overlay
    }
  }
}