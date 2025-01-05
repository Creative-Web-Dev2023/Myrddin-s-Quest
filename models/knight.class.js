class Knight extends MovableObject {
  height = 290; // Back to original height for sprite
  width = 520;  // Back to original width for sprite
  y = 190;
  delay = 3000;
  direction = 'left';
  moveRange = 100;
  startX = 800;
  isMoving = false;
  isAttacking = false;
  deathAnimationPlayed = false;
  energy = 30;
  dead = false;
 
  offset = {
    top: 120,    // Increased top offset for smaller collision box
    bottom: 70,  // Increased bottom offset for smaller collision box
    left: 210,   // Increased left offset for smaller collision box
    right: 210   // Increased right offset for smaller collision box
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
    this.energy = 30; // Initialisiere Energie (3 Treffer à 10 Schaden)
    this.loadImage('img/knight/walk/walk 0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.01 + Math.random() * 0.05; // Reduced speed for the knight
    this.otherDirection = true; // Ensure the knight always faces left
    this.attackDamage = 20; // Schaden des Ritters
    this.attackRange = 50;  // Reichweite des Angriffs
    this.attackInterval = null;  // Intervall für den Angriff
    this.healthDisplay = new KnightHealthDisplay();
    this.healthDisplay.energy = this.energy;
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
    }, 500 / 2);

    this.animationInterval = setInterval(() => {
      this.handleAnimation(); // Handle the knight's animation
    }, 500/5 ); // Increase the animation speed

    this.attackAnimationInterval = setInterval(() => { // Attack animation
      if (this.isAttacking) { // If the knight is attacking
        this.playAnimation(this.IMAGES_ATTACKING);
      }
    }, 500 / 2); // Further reduce the attack animation speed
  }
  handleMovement() { // Handle the knight's movement
    if (!this.dead && this.isMoving) { // Nutze die Property statt Methode
      this.moveLeft(); // Always move left
      this.otherDirection = true; // Mirror the image
      if (this.x <= this.startX - this.moveRange) {
        this.x = this.startX; // Return to the starting position when the end of the movement range is reached
      }
    }
  }

  handleAnimation() { // Handle the knight's animation
    if (this.dead) { // Nutze die Property statt Methode
      this.playAnimation(this.IMAGES_DEAD); // Geschwindigkeit anpassen, um die Todesanimation deutlicher zu machen
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACKING);
    } else if (this.isMoving) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) { // Todesanimation nur einmal starten
      this.deathAnimationPlayed = true; // Markiere die Animation als gestartet
      this.isDead = true; // Setze den Zustand des Ritters auf "tot"
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
    if (!this.isDead()) {
      this.isDead = true;
      this.playDeathAnimation();
      // Optional: Sound abspielen
      // playKnightDeathSound();
    }
  }

  isHurt() {
    return this.energy < 100 && this.energy > 0;
  }

  isDead() {
    return this.energy <= 0 || this.dead;
  }

  hit(damage) {
    if (this.isDead() || this.deathAnimationPlayed) return; // Wenn der Ritter tot ist, nichts tun
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
      this.playDeathAnimation(); // Todesanimation abspielen
    }
  }
  // ... existing code ...

checkForAttack(character) {
  const knightBox = this.getCollisionBox();
  const characterBox = character.getCollisionBox();
  
  // Calculate the attack range box in front of the knight
  const attackBox = {
      x: this.otherDirection ? knightBox.x - this.attackRange : knightBox.x + knightBox.width,
      y: knightBox.y,
      width: this.attackRange,
      height: knightBox.height
  };

  // Check if character is within attack range
  const isInAttackRange = (
      attackBox.x < characterBox.x + characterBox.width &&
      attackBox.x + attackBox.width > characterBox.x &&
      attackBox.y < characterBox.y + characterBox.height &&
      attackBox.y + attackBox.height > characterBox.y
  );

  if (isInAttackRange && !this.isAttacking) {
      this.attack(character);
  }
}

attack(character) {
  if (this.dead || this.isAttacking) return; // Don't attack if dead or already attacking
  
  this.isAttacking = true;
  this.playAttackAnimation();
  
  // Deal damage at the end of the attack animation
  setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const knightBox = this.getCollisionBox();
      
      // Check if still in range when the attack lands
      const isStillInRange = (
          knightBox.x < characterBox.x + characterBox.width &&
          knightBox.x + knightBox.width > characterBox.x &&
          knightBox.y < characterBox.y + characterBox.height &&
          knightBox.y + knightBox.height > characterBox.y
      );
      
      if (isStillInRange) {
          character.takeDamage(this.attackDamage);
      }
      
      // Reset attack state after animation
      setTimeout(() => {
          this.isAttacking = false;
      }, 500); // Adjust this timing based on your attack animation duration
  }, 400); // Adjust this timing to match when the attack animation shows the hit
}

playAttackAnimation() {
  this.playAnimation(this.IMAGES_ATTACKING);
}


  update(character) {
    this.checkForAttack(character); // Prüfen, ob der Angriff ausgeführt werden soll
   
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
    this.healthDisplay.updatePosition(this.x, this.y);
    this.healthDisplay.draw(ctx);
  }

  takeDamage(damage) {
    if (!this.dead) {
        // Reduziere die Energie immer nur um 10 (ein Herz)
        this.energy = Math.max(0, this.energy - 10);
        this.healthDisplay.energy = this.energy; // Aktualisiere die Anzeige
        if (this.energy <= 0) {
            this.dead = true;
            this.playDeathAnimation();
            setTimeout(() => {
                const knightIndex = this.world.enemies.findIndex(knight => knight.id === this.id);
                if (knightIndex !== -1) {
                    this.world.enemies.splice(knightIndex, 1);
                }
            }, 1000);
        } else {
            this.playAnimation(this.IMAGES_HURT);
        }
    }
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