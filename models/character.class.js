class Character extends MovableObject {
  height = 290; // Set the character's height
  width = 520; // Set the character's width
  x = 130; // Set the character's initial x position
  y = 150; // Set the character's initial y position
  speed = 5; // Set the character's speed
  invulnerable = false; // Set the character's invulnerability status
  poisonCollected = 0; // Initialize the collected poison count
  poisonStatusBar; // Add the PoisonStatusBar
  deadAnimationPlayed = false; // Track if the dead animation has been played
  hasKey = false; // Track if the character has a key
  isVisible = true; // Set the character to be visible by default
  offset = {
    top: 50, // Weniger oben abschneiden
    bottom: 10, // Weniger unten abschneiden
    left: 210, // Weniger links abschneiden
    right: 200 // Weniger rechts abschneiden
  };

  IMAGES_IDLE = [
    "img/wizard/idle/idle_000.png",
    "img/wizard/idle/idle_001.png",
    "img/wizard/idle/idle_002.png",
    "img/wizard/idle/idle_003.png",
    "img/wizard/idle/idle_004.png",
    "img/wizard/idle/idle_005.png",
    "img/wizard/idle/idle_006.png",
    "img/wizard/idle/idle_007.png",
    "img/wizard/idle/idle_008.png",
    "img/wizard/idle/idle_009.png",
  ];

  IMAGES_WALKING = [
    "img/wizard/walk/walk_001.png",
    "img/wizard/walk/walk_002.png",
    "img/wizard/walk/walk_003.png",
    "img/wizard/walk/walk_004.png",
    "img/wizard/walk/walk_005.png",
    "img/wizard/walk/walk_006.png",
    "img/wizard/walk/walk_007.png",
    "img/wizard/walk/walk_008.png",
    "img/wizard/walk/walk_009.png",
  ];

  IMAGES_JUMPING = [
    "img/wizard/jump/jump_000.png",
    "img/wizard/jump/jump_001.png",
    "img/wizard/jump/jump_002.png",
    "img/wizard/jump/jump_003.png",
    "img/wizard/jump/jump_004.png",
    "img/wizard/jump/jump_005.png",
    "img/wizard/jump/jump_006.png",
    "img/wizard/jump/jump_007.png",
    "img/wizard/jump/jump_008.png",
    "img/wizard/jump/jump_009.png",
  ];
  IMAGES_ATTACK = [
    "img/wizard/attack/Attack1.png",
    "img/wizard/attack/Attack2.png",
    "img/wizard/attack/Attack3.png",
    "img/wizard/attack/Attack4.png",
    "img/wizard/attack/Attack5.png",
    "img/wizard/attack/Attack6.png",
    "img/wizard/attack/Attack7.png",
  ];
  IMAGES_DEAD = [
    "img/wizard/die/die_000.png",
    "img/wizard/die/die_001.png",
    "img/wizard/die/die_002.png",
    "img/wizard/die/die_003.png",
    "img/wizard/die/die_004.png",
    "img/wizard/die/die_005.png",
    "img/wizard/die/die_006.png",
    "img/wizard/die/die_007.png",
    "img/wizard/die/die_008.png",
    "img/wizard/die/die_009.png",
  ];

  IMAGES_HURT = [
    "img/wizard/hurt/hurt_000.png",
    "img/wizard/hurt/hurt_001.png",
    "img/wizard/hurt/hurt_002.png",
    "img/wizard/hurt/hurt_003.png",
    "img/wizard/hurt/hurt_004.png",
    "img/wizard/hurt/hurt_005.png",
    "img/wizard/hurt/hurt_006.png",
    "img/wizard/hurt/hurt_007.png",
    "img/wizard/hurt/hurt_008.png",
    "img/wizard/hurt/hurt_009.png",
  ];
  IMAGES_FIRE_ATTACK = [
    "img/wizard/fire/fire1.png",
    "img/wizard/fire/fire2.png",
    "img/wizard/fire/fire3.png",
    "img/wizard/fire/fire4.png",
    "img/wizard/fire/fire5.png",
    "img/wizard/fire/fire6.png",
    "img/wizard/fire/fire7.png",
    "img/wizard/fire/fire8.png",
    "img/wizard/fire/fire9.png",
    "img/wizard/fire/fire10.png",
  ];
  IMAGES_YOU_LOST = [
    "img/game_ui/login&pass/game_over.png",
  ];
  world = {};
  constructor(world,poisonStatusBar) {
    super();

    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {};
    this.energy = 100;
    this.playAnimation(this.IMAGES_IDLE);
    this.animate(); // Aufruf der geerbten Methode animate
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar(); 
    this.poisonStatusBar.setPercentage(0); 
    this.statusBar = new StatusBar();
    this.loadImages(this.IMAGES_YOU_LOST);
    this.world.camera_x = -this.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
        this.y = 150; // Setze die y-Position auf den Boden
      }
    }, 1000 / 25);
  }

  throwObject() {
    if (this.canThrow()) {
      let bottle = new ThrowableObject(this.x, this.y);
      this.world.throwableObjects.push(bottle);
      this.poisonCollected--; // Decrease the collected poison count
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update the poison status bar
    }
  }
  canThrow() {
    return this.poisonCollected > 0; // Check if the character has collected poison
  }


  update() {
    if (!this.isVisible) return;
  
    if (this.energy > 0) {  // Prüfe direkt die energy statt isDead()
        walkingSound.pause();
  
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            playWalkingSound();
        }
  
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            playWalkingSound();
        }
  
        if (this.world.keyboard.JUMP && !this.isAboveGround()) {
            this.jump();
        }
  
        if (this.world.keyboard.ATTACK) {
            this.isAttacking = true;
            this.playAnimation(this.IMAGES_ATTACK);
            this.attackEnemies();
        } else {
            this.isAttacking = false;
        }

        if (this.world.keyboard.THROW_FIRE) {
            this.playAnimation(this.IMAGES_FIRE_ATTACK);
            this.shoot();
        }
  
        this.world.camera_x = -this.x - 190;
        this.checkCollisions();
    }
  }
  
  checkCollisions() {
    this.world.poisonsArray.forEach((poison, index) => {
      if (this.checkCollision(this, poison)) {
        this.collectPoison(poison, index);
      }
    });
    this.world.keysArray.forEach((key, index) => {
      if (this.checkCollision(this, key)) {
        this.collectKey(key, index);
      }
    });
    Door.checkCharacterNearDoor(this.world); // Check if the character is near the door
  }

  checkCollision(character, object) { // Check collision between character and object
    const charBox = character.getCollisionBox(); // Get the character's collision box
    const objBox = object.getCollisionBox(); // Get the object's collision box

    return ( // Check if there is a collision between the character and the object
      charBox.x < objBox.x + objBox.width && // Check collision on the x-axis
      charBox.x + charBox.width > objBox.x && // Check collision on the x-axis
      charBox.y < objBox.y + objBox.height && // Check collision on the y-axis
      charBox.y + charBox.height > objBox.y // Check collision on the y-axis
    );
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 33; // Set the jump speed
      playJumpSound(); // Play the jump sound
    }
  }

  isAboveGround() {
    return this.y < 150 || this.speedY > 0;  // Return true if the character is above the ground or moving upwards
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT; // Return true if the character is moving right or left
  }

  isHurt() {
    return this.energy < 100 && this.energy > 0;  // Energy is less than 100 and greater than 0, character is hurt
  }

  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);
    if (!this.invulnerable && distance < 100) {
        this.takeDamage(5);
        this.world.characterStatusBar.setPercentage(this.energy); // Aktualisiere die Statusleiste direkt
        this.playAnimation(this.IMAGES_HURT);
    }
  }

  takeDamage(damage) {
    if (this.energy > 0 && !this.invulnerable) {
        this.energy -= damage;
        this.world.characterStatusBar.setPercentage(this.energy); // Aktualisiere die Statusleiste direkt
        this.playAnimation(this.IMAGES_HURT);

        if (this.energy <= 0) {
            this.energy = 0;
            this.die(); // Charakter stirbt, wenn Energie 0 ist
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
        this.isVisible = false; // Make the character invisible after death
      }, 3000);
    }
  }

  updateStatusBar() {
    if (this.world && this.world.statusBar) {
      this.world.statusBar.update(this.energy); // Update the status bar with the new energy
    }
  }

  reset(level) { // Reset the character's position and energy
    this.x = 130; // Set the character's x position
    this.y = 150; // Set the character's y position
    this.isVisible = true; // 
    if (level === 2) { // If the level is 2
      this.energy = 100; // Optionale Anpassung für Level 2
      this.world.level.level_end_x = 3500; // Verkürze die Länge des Levels 2
    }
    this.poisonCollected = 0; // Reset the poison collected
    this.poisonStatusBar.setPercentage(0); // Reset the poison status bar
    this.CharacterHealthBar = new StatusBar(); // Füge eine Statusleiste für den Charakter hinzu
    this.CharacterHealthBar.setPercentage(this.energy); // Reset the character's health bar
    this.playAnimation(this.IMAGES_IDLE); // Play the idle animation
    this.animate(); // Start the animation
  }

  enterDoor() { 
    this.isVisible = false; // Make the character invisible
    setTimeout(() => {
      this.isVisible = true;  // Make the character visible after 2 seconds
    }, 2000);
  }

  checkCollisionWithDoor(door) { // Check if the character is colliding with the door
    return this.isColliding(door); // Return true if the character is colliding with the door
  }

  collectPoison(poison, index) {
    if (poison && poison.isActive) { // If the poison object is active
      poison.deactivate(); // Deactivate the poison object
      this.poisonCollected += 1; // Increase the collected poison count
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update the poison status bar
      this.world.poisonsArray.splice(index, 1); // Remove the poison object from the array
      playCollectPoisonBottleSound(); // Play the collect poison bottle sound
    }
  }

  collectKey(key, index) {
    if (key && key.isActive) { // If the key object is active
      key.deactivate(); // Deactivate the key object
      this.hasKey = true; // Set the character's hasKey property to true
      this.world.keysArray.splice(index, 1); // Remove the key object from the array
    }
  }

  draw(ctx) {
    if (this.isVisible) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  attackEnemies() {
    if (this.world.enemies) {
        this.world.enemies.forEach(enemy => {
            if (enemy instanceof Knight && !enemy.dead) {  // Prüfe ob Knight und nicht tot
                const distance = Math.abs(this.x - enemy.x);
                if (distance < 150) {  // Überprüfe die Angriffsreichweite
                    console.log('Character greift Knight an!');
                    enemy.takeDamage(10);
                }
            }
        });
    }
  }

  attack(target) {
    
    if ((target instanceof Knight || target instanceof Snake) && target.energy > 0) {  // Prüfe direkt die energy
        target.takeDamage(10);
    }
  }

  shoot() {
    if (this.world.snakes) {
        this.world.snakes.forEach(snake => {
            if (this.isColliding(snake) && snake.energy > 0) {  // Prüfe direkt die energy
                this.attack(snake);
            }
        });
    }
  }
}
