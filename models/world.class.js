class World {
  character; // Character in the game
  level; // Current level
  canvas; // Canvas element
  ctx; // Canvas context
  keyboard; // Keyboard input
  camera_x = 0; // The camera is shifted 100 to the left
  lastCloudSpawn = 0; // Time when the last cloud was created
  cloudSpawnInterval = 3000; // Interval (3 seconds)
  characterStatusBar; // Status bar for the character
  characters = []; // Array for characters
  enemies = []; // Array for enemies
  throwableObjects = []; // Array for throwable objects
  currentLevelIndex = 0; // Current level index
  levels = [level1]; // List of levels
  imageCache = {}; // Cache for images
  IMAGES_YOU_LOST = ["img/game_ui/login&pass/game_over.png"]; // Path to "You Lost" image
  quitButton; // Quit button object
  quitButtonImage = "img/game_ui/quit.png"; // Path to the quit button image
  tryAgainButton; // Try again button object
  tryAgainButtonImage = "img/game_ui/try_again.png"; // Path to the try again button image
  levelCompleted = false; // Variable to track level completion
  collectables = []; // Array for collectables
  keys = []; // Array for keys
  endGame; // EndGame class attribute
  door; // Door attribute

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d"); // Get the canvas context
    this.canvas = canvas; // Set the canvas
    this.keyboard = keyboard; // Set the keyboard input
    const buttonWidth = 100; // Width of the buttons
    const buttonHeight = 40; // Height of the buttons
    const canvasCenterX = canvas.width / 2; // Center of the canvas
    const buttonSpacing = 20; // Spacing between buttons
 
    this.quitButton = {
      x: canvasCenterX - buttonWidth - buttonSpacing / 2, // X position of the quit button
      y: this.canvas.height - buttonHeight - 20, // Y position of the quit button
      width: buttonWidth, // Width of the quit button
      height: buttonHeight, // Height of the quit button
    };
    this.tryAgainButton = {
      x: canvasCenterX + buttonSpacing / 2, // X position of the try again button
      y: this.quitButton.y, // Y position of the try again button
      width: buttonWidth, // Width of the try again button
      height: buttonHeight, // Height of the try again button
    };
    this.keyboard.T = false; // Initialize the T key
    this.keyboard.D = false; // Initialize the D key
    this.level = this.levels[this.currentLevelIndex]; // Initialize the first level
    this.clouds = new Clouds(this.level.clouds); // Initialize the Clouds class
    this.clouds.randomizePositions(); // Set random positions for the clouds
    this.poisonStatusBar = new PoisonStatusBar(); // Initialize the poison status bar
    this.characterStatusBar = new StatusBar(this.character); // Initialize character status bar
    if (this.level.endboss) { // Check if the level has an endboss
      this.endbossHealthBar = new EndbossStatusBar( // Initialize the endboss health bar
        this.level.endboss.x, // X position of the endboss health bar
        this.level.endboss.y - 50 // Y position of the endboss health bar
      );
    }
    this.character = new Character(this, this.poisonStatusBar); // Initialize character with parameters
    this.character.world.keyboard = this.keyboard; // Forward keyboard to character
    this.poisonsArray = PoisonObject.initializePoisons(); // Initialize poison objects
    this.keysArray = Key.initializeKeys(); // Initialize keys
    this.backgroundObjects = this.level.backgroundObjects || []; // Ensure it is an array
    this.enemies = this.level.enemies || []; // Initialize enemies from the level
    this.level.objects = this.level.objects || []; // Ensure objects is an array
    this.level.clouds = this.level.clouds || []; // Ensure clouds is an array
    this.loadImages(this.IMAGES_YOU_LOST); // Load the "You Lost" image
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]); // Load the button images
    this.door = new Door(1000, 200); // Initialize the door with a position
    this.setWorld(); // Set the world for the character and enemies
    this.startGameLoop(); // Start the game loop
    this.camera_x = -this.character.x - 190; // Set the camera to the character's starting position
    this.endGame = new EndGame(this); // Initialize the EndGame class
  }

  setWorld() {
    this.character.world = this; // Set the world property for the character
    this.enemies.forEach((enemy) => { // Iterate over the enemies
      if (enemy instanceof Knight) { // Check if the enemy is a knight 
        enemy.world = this; // Set the world property for the knight
        enemy.otherDirection = true; // Ensure the knight always faces left
      }
    });
    if (this.door) { // Check if the door exists
      this.door.world = this; // Set the world property for the door
    }
  }

  loadImages(images) { // Load images into the image cache
    images.forEach((path) => { // Iterate over the image paths
      const img = new Image(); // Create a new image object 
      img.src = path; // Set the source of the image
      this.imageCache[path] = img; // Store the image in the cache
    });
  }

  startGameLoop() {
    this.canvas.addEventListener("click", this.handleMouseClick.bind(this)); // Add event listener
    const gameLoop = () => { // Define the game loop
      this.update(); // Update the game state
      this.draw(); // Draw the game state
      this.enemies.forEach((enemy) => {
        if (enemy instanceof Knight) {
          enemy.update(this.character); // Überprüfe, ob der Ritter angreifen soll
        }
      });
      requestAnimationFrame(gameLoop); // Call the game loop again
    };
    gameLoop(); // Start the game loop 
  }

  update() {
    if (this.levelCompleted) return; // Stop the update if the level is completed
    this.checkCollisionsWithEnemies(); // Check collisions with enemies
    this.checkCollisionWithKnights(); // Check collisions with knights
    this.character.update(); // Update the character
    this.updatePoison(); // Update poison objects
    this.checkThrowableObject(); // Check if a bottle should be thrown
    this.checkCollisionsWithCollectables(); // Check collisions with collectables
    this.checkDoorCollision(); // Check collisions with the door
    if (this.character.isMoving() && musicIsOn) { // Check if the character is moving and music is on
      playWalkingSound(); // Play walking sound only if music is on
    }
    if (this.character.isDead() && !this.levelCompleted) { // Check if the character is dead
      setTimeout(() => {
        this.endGame.showYouLostScreen(); // Show the "You Lost" screen
      }, 200); // Short delay before showing the screen
    }
  }

  checkCollisionsWithEnemies() {
    this.enemies.forEach((enemy) => {
      if (this.checkCollision(this.character, enemy)) {
        if (this.character.isAboveGround() && this.character.speedY > 0) {
          this.character.jump();
          if (enemy.isDead) {
            return;
          } else {
            if (enemy.IMAGES_HURT) { // Check if the enemy has hurt images
              enemy.playAnimation(enemy.IMAGES_HURT);
            }
            setTimeout(() => {
              if (enemy.IMAGES_DEAD) { // Check if the enemy has dead images
                enemy.playAnimation(enemy.IMAGES_DEAD);
              }
              setTimeout(() => {
                const index = this.enemies.findIndex(e => e.id === enemy.id);
                if (index !== -1) {
                  this.enemies.splice(index, 1);
                }
              }, 1500);
            }, 1000);
          }
        } else {
          this.character.hit(enemy);
          this.characterStatusBar.setPercentage(this.character.energy);
        }
      } else if (enemy instanceof Snake) {
        const distance = Math.abs(this.character.x - enemy.x);
        if (distance <= 100 && !enemy.isDead) {
          enemy.attack();
        }
      }
    });
  }

  checkCollisionWithKnights() {
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Knight && this.character.isColliding(enemy)) {
        const characterBox = this.character.getCollisionBox();
        const knightBox = enemy.getCollisionBox();
        if (
          this.character.speedY > 20 &&
          characterBox.y + characterBox.height <= knightBox.y + knightBox.height &&
          characterBox.x + characterBox.width > knightBox.x &&
          characterBox.x < knightBox.x + knightBox.width
        ) {
          this.character.jump();
          enemy.playDeathAnimation();
          setTimeout(() => {
            const knightIndex = this.enemies.findIndex(knight => knight.id === enemy.id);
            if (knightIndex !== -1) {
              this.enemies.splice(knightIndex, 1);
            }
          }, 1500);
        }
      }
    });
  }

  updatePoison() { // Update the poison objects 
    this.poisonsArray.forEach((poison, index) => { // Iterate over the poison objects
      if (poison.isActive && this.checkCollision(this.character, poison)) { // Check if the poison is active and colliding with the character
        this.character.collectPoison(poison, index); // Collect the poison
      }
    });
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

  addCharacter(character) {
    this.characters.push(character); // Add a character to the array
  }

  addEnemy(enemy) {
    this.enemies.push(enemy); // Add an enemy to the array
  }

  draw() {
    this.clearCanvas(); // Clear the canvas
    this.drawBackground(); // Draw the background
    this.drawStatusBars(); // Draw the status bars
    this.drawGameObjects(); // Draw the game objects
    this.drawEnemies(); // Draw the enemies
    this.drawCharacter(); // Draw the character
    if (this.keysArray.length > 0) {
      this.keysArray[0].draw(this.ctx); // Draw the single key
    }
   
    if (this.door) {
      this.door.draw(this.ctx); // Draw the door
    }
    if (this.character.isDead()) {
      this.endGame.showYouLostScreen(); // Show the "You Lost" screen
    }
  }

  drawGameObjects() { // Draw the game objects
    this.ctx.translate(this.camera_x, 0); // Translate the canvas
    this.addObjectsToMap(this.enemies); // Add enemies to the map
    this.addObjectsToMap(this.poisonsArray); // Add poison objects to the map
    this.throwableObjects.forEach((bottle) => {
      bottle.draw(this.ctx, this.camera_x); // Draw the throwable objects
    });
    this.ctx.translate(-this.camera_x, 0); // Reset the translation
  }
  

  clearCanvas() { // Clear the canvas 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
  }

  drawBackground() { // Draw the background
    this.ctx.translate(this.camera_x, 0); // Translate the canvas
    this.addObjectsToMap(this.backgroundObjects); // Add background objects to the map
    if (Array.isArray(this.level.clouds)) { // Ensure clouds is an array
      this.addObjectsToMap(this.level.clouds); // Add clouds to the map
    }
    this.ctx.translate(-this.camera_x, 0); // Reset the translation
  }

  drawStatusBars() {
    this.addToMap(this.poisonStatusBar); // Draw the poison status bar
    this.addToMap(this.characterStatusBar); // Draw the character status bar
    this.characterStatusBar.draw(this.ctx); // Draw the character status bar
    this.poisonStatusBar.draw(this.ctx); // Draw the poison status bar
    if (this.currentLevelIndex === 1 && this.level.endboss) { // Check if the level is level 2 and the endboss exists
      this.endbossHealthBar.x = this.level.endboss.x; // Set the x position of the endboss health bar
      this.endbossHealthBar.y = this.level.endboss.y - 50; // Set the y position of the endboss health bar
      this.addToMap(this.endbossHealthBar); // Add the endboss health bar to the map
      this.endbossHealthBar.draw(this.ctx); // Draw the endboss health bar
    }
    this.addToMap(this.character.healthBar); // Add the character's health bar to the map
  }

  drawEnemies() { // Draw the enemies
    this.enemies.forEach((enemy) => {
      enemy.draw(this.ctx); // Draw the enemy
    });
    if (this.level === level2 && this.level.endboss) { // Check if the level is level 2 and the endboss exists
      this.level.endboss.draw(this.ctx); // Draw the endboss only in level 2
    }
  }

  drawCharacter() {
    this.ctx.translate(this.camera_x, 0); // Translate the canvas
    this.addToMap(this.character); // Add the character to the map
    this.characters.forEach((character) => character.draw(this.ctx)); // Draw the characters
    this.ctx.translate(-this.camera_x, 0); // Reset the translation
  }

  handleMouseClick(event) {
    const rect = this.canvas.getBoundingClientRect(); // Get the canvas bounding rectangle
    const x = event.clientX - rect.left; // Get the x position of the click
    const y = event.clientY - rect.top; // Get the y position of the click

    if (
      x >= this.quitButton.x && // Check if the click is within the quit button
      x <= this.quitButton.x + this.quitButton.width && // Check if the click is within the quit button
      y >= this.quitButton.y && // Check if the click is within the quit button
      y <= this.quitButton.y + this.quitButton.height // Check if the click is within the quit button
    ) {
      // Handle quit button click
    }
  }

  addObjectsToMap(objects) { // Add objects to the map 
    if (objects && Array.isArray(objects)) { // Check if objects is an array and exists 
      objects.forEach((object) => { // Iterate over the objects 
        this.addToMap(object); // Add objects to the map
      });
    } else {
      console.error("Objects is not an array or is undefined"); // Log an error if objects is not an array
    }

    if (
      this.backgroundObjects.length > 0 && // Check if there are background objects
      this.camera_x >= this.backgroundObjects[0].width // Check if the background has left the screen
    ) {
      this.camera_x = 0; // Reset the camera
    }
  }

  addToMap(mo) { // Add the object to the map
    if (mo && mo.otherDirection) { // Check if the object is facing the other direction 
      this.flipImage(mo); // Flip the image if necessary
    }
    if (mo) { // Check if the object exists 
      mo.draw(this.ctx); // Draw the image
      mo.drawFrame(this.ctx); // Update the image
    }
    if (mo && mo.otherDirection) { // Check if the object is facing the other direction
      this.flipImageBack(mo); // Flip the image back
    }
  }

  flipImage(mo) { // Flip the image 
    this.ctx.save(); // Save the current state of the canvas
    this.ctx.translate(mo.width, 0); // Move the image by the width of the image
    this.ctx.scale(-1, 1); // Flip the image
    mo.x = mo.x * -1; // Rotate the image 180 degrees
  }

  flipImageBack(mo) { // Flip the image back to the original state 
    mo.x = mo.x * -1; // Rotate the image 180 degrees back
    this.ctx.restore(); // Restore the saved state
  }

  checkThrowableObject() {
    if (this.keyboard.D && this.character.poisonCollected > 0) { // Check if the D key is pressed and poison is collected
      this.character.throwObject(); // Throw the object
      playPoisonBottleSound(); // Play sound when the bottle is thrown
    }
  }

  checkCollisionsWithCollectables() {
    this.poisonsArray.forEach((poison, index) => {
      if (this.checkCollision(this.character, poison) && poison.isActive) {
        poison.deactivate(); // Deactivate the poison
        this.character.collectPoison(poison, index); // Collect the poison
      }
    });
    this.keysArray.forEach((key, index) => {
      if (key.isActive && this.checkCollision(this.character, key)) {
        key.deactivate(); // Deaktiviert den Schlüssel
        this.keysArray.splice(index, 1); // Entfernt den Schlüssel aus dem Array
        this.character.collectKey(); // Implementiere diese Methode, falls du zusätzliche Logik für das Aufsammeln hinzufügen willst
      }
    });
  }

  checkDoorCollision() {
    const door = this.door; // Door from the current level
    if (this.character.checkCollisionWithDoor(door)) {
      this.character.enterDoor(); // Animation when entering the door
      setTimeout(() => {
        this.levelCompleted = true; // Mark the level as completed
        continueToNextLevel(); // Switch to the next level
      }, 2000); // Short delay before switching levels
    }
  }
}
