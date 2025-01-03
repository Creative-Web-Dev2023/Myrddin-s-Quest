class Knight extends MovableObject {
  height = 290; // Increase the height of the knight
  width = 520; // Increase the width of the knight
  y = 190; // Increase the Y position to position the knight higher
  delay = 3000; // Delay before the knight starts moving
  direction = 'left'; // Initial direction
  moveRange = 100; // Movement range
  startX = 800; // Starting position
  isMoving = false; // State for moving the knight left and right
  isAttacking = false; // State for attacking the knight
  deathAnimationPlayed = false; // Neues Flag für die Todesanimation
  energy = 30;
  dead = false; // Verwende 'dead' als Property statt 'isDead'
 
  offset = {
    top: 80, // Weniger oben abschneiden
    bottom: 30, // Weniger unten abschneiden
    left: 110, // Weniger links abschneiden
    right: 210 // Weniger rechts abschneiden
}

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
 
  attack(character) {
    if (this.isColliding(character)) { // Überprüfen, ob der Ritter mit dem Charakter kollidiert
      character.takeDamage(this.attackDamage); // Schaden auf den Charakter anwenden
      this.playAttackAnimation(); // Angriff-Animation abspielen
    } 
    
  }

  playAttackAnimation() {
    if (!this.isAttacking) { // Verhindere, dass die Animation mehrfach gleichzeitig abgespielt wird
      this.isAttacking = true; // Setze den Zustand auf "angreifend"
      this.playAnimation(this.IMAGES_ATTACKING, 200); // Spiele die Animation mit einer Frame-Verzögerung ab
      setTimeout(() => {
        this.isAttacking = false; // Setze den Zustand nach der Animation zurück
      }, this.IMAGES_ATTACKING.length * 200); // Gesamtdauer der Animation basierend auf der Anzahl der Frames
    }
  }
  
  checkForAttack(character) {
    const knightBox = this.getCollisionBox(); // Kollisionsbox des Ritters
    const characterBox = character.getCollisionBox(); // Kollisionsbox des Charakters
    // console.log('Ritter Kollisionsbox:', knightBox); // Debugging-Log für die Kollisionsbox des Ritters
    // console.log('Charakter Kollisionsbox:', characterBox); // Debugging-Log für die Kollisionsbox des Charakters

    const isColliding = (
      knightBox.x < characterBox.x + characterBox.width &&
      knightBox.x + knightBox.width > characterBox.x &&
      knightBox.y < characterBox.y + characterBox.height &&
      knightBox.y + knightBox.height > characterBox.y
    );
    // console.log('Kollision erkannt:', isColliding); // Debugging-Log für Kollisionserkennung
    if (isColliding) { // Wenn die Kollisionsboxen sich überschneiden
      this.attack(character); // Angriff ausführen
    }
  }

  update(character) {
    this.checkForAttack(character); // Prüfen, ob der Angriff ausgeführt werden soll
    // Weitere Logik für Bewegung des Ritters kann hier hinzugefügt werden
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
        console.log(`Knight nimmt 10 Schaden, verbleibende Energie: ${this.energy}`);
        
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