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
    top: 50, // Reduce the rectangle from the top
    bottom: 10, // Reduce the rectangle from the bottom
    left: 200, // Reduce the rectangle from the left
    right: 200, // Reduce the rectangle from the right
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
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.applyGravity();
    this.energy = 100; // Energie des Charakters
    this.playAnimation(this.IMAGES_IDLE);
    this.animate(); // Aufruf der geerbten Methode animate
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusBar(); 
    this.poisonStatusBar.setPercentage(0); 
    this.CharacterHealthBar = new StatusBar(); // Füge eine Statusleiste für den Charakter hinzu
    this.CharacterHealthBar.setPercentage(this.energy); // Setze die Energie der Statusleiste
    this.statusBar = new StatusBar();
    this.loadImages(this.IMAGES_YOU_LOST);
    this.world.camera_x = -this.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
  }

  throwObject() {
    if (this.world && this.world.throwableObjects) {
      const throwableObject = new ThrowableObject(this.x + this.width / 2, this.y + this.height / 2);
      this.world.throwableObjects.push(throwableObject);
      playPoisonBottleSound(); // Spiele den Sound ab, wenn die Flasche geworfen wird
    } else {
      console.error('throwableObjects array is not initialized in the world');
    }
  }

  update() {
    if (!this.isVisible) return; // If the character is not visible, exit the function
    if (!this.isDead()) { // If the character is not dead
      walkingSound.pause(); // Pause the walking sound
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { // If the right arrow key is pressed and the character is within the level boundaries
      this.moveRight(); // Move the character to the right
      this.otherDirection = false; // Set the direction to right
      playWalkingSound(); // Play the walking sound
      }
      if (this.world.keyboard.LEFT && this.x > 0) { // If the left arrow key is pressed and the character is within the level boundaries
      this.moveLeft(); // Move the character to the left
      this.otherDirection = true; // Set the direction to left
      playWalkingSound(); // Play the walking sound
      }
      if (this.world.keyboard.JUMP && !this.isAboveGround()) { // If the jump key is pressed and the character is on the ground
      this.jump(); // Make the character jump
      }
      this.world.camera_x = -this.x - 190; // Update the camera position based on the character's position
      this.checkCollisions(); // Check for collisions
    }
  }
  checkCollisions() {
    CollisionUtils.checkCollisionWithObjects(this, this.world.poisonsArray, this.collectPoison.bind(this)); // Check collision with poison objects
    CollisionUtils.checkCollisionWithObjects(this, this.world.keysArray, this.collectKey.bind(this)); // Check collision with key objects
    Door.checkCharacterNearDoor(this.world); // Check if the character is near the door
    this.checkJumpOnKnight(); // Check if the character jumps on a knight
    this.checkKnightAttack(); // Check if the knight attacks the character
  }

  checkCollisionWithObjects(objectsArray, callback) {
    objectsArray.forEach((object, index) => {
      if (this.isColliding(object)) { // If the character is colliding with the object
        callback(object, index); // Execute the callback function
      }
    });
  }

  collectPoison(poison, index) {
    if (poison && poison.isActive) { // If the poison object is active
      poison.deactivate(); // Deactivate the poison object
      this.poisonCollected += 1; // Increase the collected poison count
      this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update the poison status bar
      this.world.poisonsArray.splice(index, 1); // Remove the poison object from the array
    }
  }

  collectKey(key, index) {
    this.hasKey = true; // Set hasKey to true when the character collects a key
    this.world.keysArray.splice(index, 1); // Remove the key from the array
  }

  jump() {
    this.speedY = 33; // Set the jump speed
    playJumpSound(); // Play the jump sound
  }

  attackEndboss(endboss) {
    if (this.world.keyboard && this.world.keyboard.THROW) { // If the throw key is pressed
      if (!this.isAttacking) { // If the character is not already attacking
        this.isAttacking = true; // Set isAttacking to true
        this.playAnimation(this.IMAGES_FIRE_ATTACK); // Play the fire attack animation
        playFireAttackSound(); // Play the fire attack sound

        setTimeout(() => {
          endboss.energy -= 20; // Decrease the endboss's energy
          if (endboss.energy <= 0) { // If the endboss's energy is less than or equal to 0
            endboss.energy = 0; // Set the endboss's energy to 0
            endboss.isDead = true; // Set the endboss's isDead to true
            endboss.playAnimation(endboss.IMAGES_DEAD); // Play the endboss's dead animation
            setTimeout(() => {
              this.world.level.endboss = null; // Remove the endboss from the level
            }, 2000); // Delay the removal by 2000 ms (2 seconds)
          } else {
            endboss.playAnimation(endboss.IMAGES_HURT); // Play the endboss's hurt animation
          }
          this.isAttacking = false; // Set isAttacking to false
        }, 500); // Delay the attack by 500 ms (0.5 seconds)
      }
    }
  }


  isAboveGround() {
    return this.y < 150;  // Return true if the character is above the ground
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT; //return true if the character is moving right or left
  }
  isHurt() {
    return this.energy < 100 && this.energy > 0;  // energy is less than 100 and greater than 0, character is hurt
     }
  isDead() {
    return this.energy == 0;  //when energy is 0, character is dead
  }

  checkJumpOnKnight() {
    this.world.enemies.forEach((enemy, index) => { //  for each enemy in the enemies array do the following
      if (enemy instanceof Knight && this.isColliding(enemy) && this.speedY < 0) { // if the enemy is a knight and the character is colliding with the knight and the character is moving upwards
        this.handleKnightCollision(enemy, index); // handle the collision with the knight
      }
    });
  }

  handleKnightCollision(enemy, index) { // handle the collision with the knight
    if (!enemy.isDead) { // if the knight is not dead
      enemy.die();  // kill the knight
      enemy.playAnimation(enemy.IMAGES_HURT); // play the hurt animation
      setTimeout(() => {// 
        enemy.playAnimation(enemy.IMAGES_DEAD);// play the dead animation
        setTimeout(() => { // 
          this.world.enemies.splice(index, 1);// remove the knight from the enemies array
        }, 3000); 
      }, 1000); 
    }
  }
  checkKnightAttack() {
    this.world.enemies.forEach((enemy) => { // for each enemy in the enemies array do the following
      if (enemy instanceof Knight) { // if the enemy is a knight
        const distance = Math.abs(this.x - enemy.x); // Calculate distance between character and knight
        if (distance <= 100 && !this.isAboveGround() && !enemy.isHurt()) {
          enemy.isAttacking = true; // Set knight's attacking status to true
          enemy.playAnimation(enemy.IMAGES_ATTACKING); // Knight plays attacking animation
          setTimeout(() => {
            // Attack only if the character is still close enough and on the ground
            if (!this.isAboveGround() && this.isColliding(enemy)) {
              this.hit(enemy); // Knight attacks
            }
          }, 1000); // Delay the attack by 1000 ms
        } else {
          enemy.isAttacking = false; // Reset knight's attacking status
        }
      }
    });
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
    this.CharacterHealthBar.setPercentage(this.energy); // Reset the character's health bar
    this.playAnimation(this.IMAGES_IDLE); // Play the idle animation
    this.animate(); // Start the animation
  }

  draw(ctx) { 
    if (!this.isVisible) return; //   If the character is not visible, do not draw
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // Draw the character
    this.poisonStatusBar.draw(ctx); // Draw the poison status bar
    this.CharacterHealthBar.draw(ctx);  // Draw the character's health bar
    this.drawFrame(ctx); //   Draw the frame
  }

  drawFrame(ctx) { // Draw the frame around the character
    ctx.beginPath(); // Begin the path
    ctx.lineWidth = '4'; // Set the line width
    ctx.strokeStyle = 'blue'; // Set the stroke style
    ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
    // Draw the rectangle around the character
    ctx.stroke(); // Stroke the path to draw the rectangle
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

  checkCollisionsWithEnemy(enemies) { // Check if the character is colliding with the enemies
    for (let i = 0; i < enemies.length; i++) { // Loop through the enemies array
      const enemy = enemies[i]; // Get the enemy at the current index
      if (this.isColliding(enemy)) { // Check if the character is colliding with the enemy
        if (this.isAboveGround() && this.speedY > 0) { // If the character is above the ground and moving downwards
          this.jump();  // Make the character jump
          if (enemy.isDead()) {   // If the enemy is dead
            return;   // Return from the function without doing anything
          } else {
            
            enemy.playAnimation(enemy.IMAGES_HURT); // Play the hurt animation
            setTimeout(() => {
              enemy.playAnimation(enemy.IMAGES_DEAD); // Play the dead animation
              setTimeout(() => {
                this.world.enemies.splice(i, 1); // Remove the enemy from the enemies array after 3 seconds
              }, 1500); // Delay the removal by 1500 ms (1.5 seconds)
            }, 1000); // Delay the death animation by 1000 ms (1 second) 
          }
          break; // Break out of the loop after the collision is handled 
        } else {
          this.hit(enemy); // Handle the collision by hitting the enemy
          this.world.characterStatusBar.setPercentage(this.energy); // Update characterStatusBar
        }
      }
    }
  }

  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x);  // Calculate the distance between the character and the enemy
    if (!this.invulnerable && distance < 100) { // Check if the character is vulnerable and close enough to the enemy
      this.energy -= 10;  // Reduce the character's energy by 10
      if (this.energy <= 0) { // Check if the character's energy is less than or equal to 0
        this.energy = 0;  // Set the character's energy to 0
      }
      this.CharacterHealthBar.setPercentage(this.energy);   // Update the character's health bar
      this.invulnerable = true;   // Set the character to invulnerable
      setTimeout(() => {
        this.invulnerable = false;  // Set the character to vulnerable after 1 second
      }, 1000);
    }
  }
}