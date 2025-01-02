class Knight extends MovableObject {
  height = 270; // Increase the height of the knight
  width = 400; // Increase the width of the knight
  y = 200; // Increase the Y position to position the knight higher
  delay = 3000; // Delay before the knight starts moving
  direction = 'left'; // Initial direction
  moveRange = 100; // Movement range
  startX = 800; // Starting position
  isMoving = false; // State for moving the knight left and right
  isAttacking = false; // State for attacking the knight
  dead = false; // State for dead
  deathAnimationPlayed = false; // Neues Flag für die Todesanimation
 
  offset = {
    top: 80, // Reduce the top offset values
    bottom: 30, // Extend the bottom offset values
    left: 80, // Reduce the left offset values
    right: 190 // Reduce the right offset values
  };

  IMAGES_WALKING = [
    'img/knight/walk/walk 0.png',
    'img/knight/walk/walk 1.png',
    'img/knight/walk/walk 2.png',
    'img/knight/walk/walk 3.png',
    'img/knight/walk/walk 4.png',
    'img/knight/walk/walk 5.png',
  ];
  IMAGES_ATTACKING = [
    'img/knight/attack/attack 0.png',
    'img/knight/attack/attack 1.png',
    'img/knight/attack/attack 2.png',
    'img/knight/attack/attack 3.png',
    'img/knight/attack/attack 4.png',
    'img/knight/attack/attack 5.png',
    'img/knight/attack/attack 6.png',
  ];
  IMAGES_HURT = [
    'img/knight/hurt/hurt 0.png',
    'img/knight/hurt/hurt 1.png',
  ];
  IMAGES_DEAD = [
    'img/knight/death/death 0.png',
    'img/knight/death/death 1.png',
    'img/knight/death/death 2.png',
    'img/knight/death/death 3.png',
    'img/knight/death/death 4.png',
    'img/knight/death/death 5.png',
  ];

  constructor(delay = 0, startX = 800, moveRange = 100, id) { // Add the delay, startX, and moveRange parameters
    super(); // Call the parent constructor function with the super keyword
    this.id = id; // Set the id for the knight
    this.x = startX;  // Set the X position
    this.startX = startX; // Set the starting  X position
    this.moveRange = moveRange; // Set the movement range for the knight
    this.loadImage('img/knight/walk/walk 0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.01 + Math.random() * 0.05; // Reduced speed for the knight
    this.otherDirection = true; // Ensure the knight always faces left
    setTimeout(() => { // Delay the start of the knight's movement
      this.isMoving = true; // Start the knight's movement
      this.animate(); // Start the knight's animation
    }, delay);   // Delay the start of the knight's movement
  }

  loadImages(images) { // Load the images for the knight
    images.forEach((path) => {  // Load the images
      const img = new Image();  // Create a new image
      img.src = path; // Set the image source
      this.imageCache[path] = img; // Add the image to the cache
    });
  }

  setWorld(world) { // Set the world for the knight
    this.world = world; // Set the world
  }

  animate() {
    this.movementInterval = setInterval(() => {
      this.handleMovement(); // Handle the knight's movement
    }, 1000 / 30);

    this.animationInterval = setInterval(() => {
      this.handleAnimation(); // Handle the knight's animation
    }, 1000 / 10); // Increase the animation speed

    this.attackAnimationInterval = setInterval(() => { // Attack animation
      if (this.isAttacking) { // If the knight is attacking
        this.playAnimation(this.IMAGES_ATTACKING);
      }
    }, 1000 / 10); // Increase the attack animation speed
  }

  handleMovement() { // Handle the knight's movement
    if (!this.dead && this.isMoving) { // If the knight is not dead and is moving
      this.moveLeft(); // Always move left
      this.otherDirection = true; // Mirror the image
      if (this.x <= this.startX - this.moveRange) {
        this.x = this.startX; // Return to the starting position when the end of the movement range is reached
      }
    }
  }

  handleAnimation() { // Handle the knight's animation
    if (this.dead) { // Wenn der Ritter tot ist, spiele nur die Todesanimation ab
      this.playAnimation(this.IMAGES_DEAD, 100); // Geschwindigkeit anpassen, um die Todesanimation deutlicher zu machen
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACKING, 100);
    } else if (this.isMoving) {
      this.playAnimation(this.IMAGES_WALKING, 100);
    }
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) { // Todesanimation nur einmal starten
      this.deathAnimationPlayed = true; // Markiere die Animation als gestartet
      this.dead = true; // Setze den Zustand des Ritters auf "tot"
      this.playAnimation(this.IMAGES_DEAD); // Animation abspielen
      setTimeout(() => {
        // Ritter bleibt kurz liegen, bevor er verschwindet
        setTimeout(() => {
          this.removeKnight(); // Ritter nach einer längeren Verzögerung entfernen
        }, 1000); // Wartezeit, bevor der Ritter verschwindet
      }, 3000); // Wartezeit für die Animation verlängern
    }
  }


  die() {
    this.energy = 0;
    this.isDead = true;
  }

  isHurt() {
    return this.energy < 100 && this.energy > 0;
  }

  isDead() {
    return this.energy == 0;
  }

  hit(damage) {
    if (this.dead || this.deathAnimationPlayed) return; // Wenn der Ritter tot ist, nichts tun
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
      this.playDeathAnimation(); // Todesanimation abspielen
    }
  }

  removeKnight() {
    if (this.world && this.world.knights) { // Überprüfen, ob this.world und this.world.knights definiert sind
      const knightIndex = this.world.knights.findIndex(knight => knight.id === this.id);
      if (knightIndex !== -1) {
        this.world.knights.splice(knightIndex, 1); // Entferne den Ritter aus dem Array
      }
    }
  }

  draw(ctx) {
    super.draw(ctx); // Draw the knight
  }

  drawCollisionBox(ctx) {  // Draw the collision box for the knight
    super.drawCollisionBox(ctx, 'blue');
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };
  }

}