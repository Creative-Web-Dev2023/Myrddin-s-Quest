class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // The camera is shifted 100 to the left
  lastCloudSpawn = 0; // Time when the last cloud was created
  cloudSpawnInterval = 3000; // Interval (3 seconds)
  poisonsArray = [];
  characterStatusBar; // StatusBar für den Charakter
  knightStatusBars = []; // StatusBars für die Ritter
  characters = [];
  enemies = [];
  throwableObjects = []; // Add a throwable object
  currentLevelIndex = 0; // Current level
  levels = [level1]; // List of levels
  imageCache = {}; // Initialize the imageCache
  IMAGES_YOU_LOST = ["img/game_ui/login&pass/game_over.png"];
  quitButton;
  quitButtonImage = "img/game_ui/quit.png"; // Path to the quit button image
  tryAgainButton;
  tryAgainButtonImage = "img/game_ui/try_again.png"; // Path to the try again button image
  levelCompleted = false; // Add a variable to track level completion
  collectables = []; // Add an array for collectables
  keys = []; // Add an array for keys
  endGame; // Add endGame as a class attribute
  door; // Add the door as an attribute

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    const buttonWidth = 100;
    const buttonHeight = 40;
    const canvasCenterX = canvas.width / 2;
    const buttonSpacing = 20;

    this.quitButton = {
      x: canvasCenterX - buttonWidth - buttonSpacing / 2,
      y: this.canvas.height - buttonHeight - 20,
      width: buttonWidth,
      height: buttonHeight,
    };
    this.tryAgainButton = {
      x: canvasCenterX + buttonSpacing / 2,
      y: this.quitButton.y,
      width: buttonWidth,
      height: buttonHeight,
    };
    this.keyboard.T = false; // Initialize the T key
    this.keyboard.D = false; // Initialize the D key
    this.level = this.levels[this.currentLevelIndex]; // Initialize the first level
    this.randomizeCloudPositions(); // Set random positions for clouds
    this.poisonStatusBar = new PoisonStatusBar(); // Ensure the poison status bar is initialized
    this.characterStatusBar = new StatusBar(this.character); // Initialisiere characterStatusBar
    if (this.level.endboss) {
      this.endbossHealthBar = new EndbossStatusBar(
        this.level.endboss.x,
        this.level.endboss.y - 50
      ); // Ensure the name is correct
    }
    this.character = new Character(this, this.poisonStatusBar); // Initialize character with parameters
    this.character.world.keyboard = this.keyboard; // Forward keyboard to character
    this.poisonsArray = CollectableObjects.initializePoisons(); // Initialize poison objects
    this.keysArray = CollectableObjects.initializeKeys(); // Initialize keys
    this.backgroundObjects = this.level.backgroundObjects || []; // Ensure it is an array
    this.enemies = this.level.enemies || []; // Initialize enemies from the level
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
    });
    if (this.door) {
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
      requestAnimationFrame(gameLoop);// Call the game loop again
    };
    gameLoop();
  }

  update() {
    if (this.levelCompleted) return; // Stop the update if the level is completed
    this.checkCollisionsWithEnemy();
    this.character.update();
    this.updatePoison();
    this.checkCollisionsWithEndboss();
    this.updateKnightHealthBars();
    this.checkThrowableObject(); // Check if a bottle should be thrown
    this.checkCollisionsWithCollectables();
    this.character.checkKnightAttack(); // Check if the knight attacks the character
    this.checkDoorCollision(); // Check collisions with the door
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound(); // Play walking sound only if music is on
    }
    if (this.character.isDead() && !this.levelCompleted) {
      setTimeout(() => {
        this.endGame.showYouLostScreen(); // Show the "You Lost" screen
      }, 200); // Shorten the time to 500ms
    }
  }

  randomizeCloudPositions() {
    const totalLength = 2600; // Total length of the level
    const cloudCount = this.level.clouds.length;
    const spacing = totalLength / cloudCount; // Spacing between clouds

    this.level.clouds.forEach((cloud, index) => {
      cloud.x = index * spacing + Math.random() * spacing; // Distribute evenly and randomly within the spacing
      cloud.y = Math.random() * 50; // Random y-position, not too low
    });
  }

  checkCollisionsWithEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit(enemy);
        this.characterStatusBar.setPercentage(this.character.energy); // Update characterStatusBar
        if (enemy instanceof Knight) {
          enemy.energy -= 20; // Reduce the knight's energy
          enemy.knightStatusBar.setPercentage(enemy.energy); // Update knightStatusBar
          if (enemy.isDead()) { // Check if the knight is dead
            enemy.playAnimation(enemy.IMAGES_DEAD);
          } else if (enemy.isHurt()) {
            enemy.playAnimation(enemy.IMAGES_HURT);
          }
        }
      }
    });
  }
  
  checkCollisionsWithEndboss() {
    if (this.level.endboss && this.character.isColliding(this.level.endboss)) {
      this.character.attackEndboss(this.level.endboss);
    }
  }

  updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (poison.isActive && this.character.isColliding(poison)) {
        this.character.collectPoison(poison, index); // Call correctly
      }
    });
  }

  updateKnightHealthBars() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Knight && typeof enemy.updateHealthBar === 'function') {
        enemy.updateHealthBar();
      }
    });
  }


  killSnakes() {
    this.level.enemies = this.level.enemies.filter((enemy) => !(enemy instanceof Snake));
  }

  checkCollision(character, object) {
    const charBox = character.getHitbox();
    const objBox = object.getHitbox();

    return (
      charBox.x < objBox.x + objBox.width &&
      charBox.x + charBox.width > objBox.x &&
      charBox.y < objBox.y + objBox.height &&
      charBox.y + charBox.height > objBox.y
    );
  }
  addCharacter(character) {
    this.characters.push(character);
  }
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  draw() {
    this.clearCanvas();
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawEnemies();
    this.drawCharacter();
    this.drawPoisons(); // Draw the poison bottles
    this.drawKeys(); // Draw the keys
    this.drawKnightHealthBars(); // Draw the knight health bars
    if (this.door) {
      this.door.draw(this.ctx); // Draw the door
    }
    if (this.character.isDead()) {
      this.endGame.showYouLostScreen(); // Use the method from the EndGame class
    }
    this.drawCollectables(); // Draw the collectables
  }

  drawPoisons() {
    this.poisonsArray.forEach((poison) => {
      if (poison.isActive) {
        poison.draw(this.ctx);
      }
    });
  }

  drawKeys() {
    this.keysArray.forEach((key) => {
      if (key.isActive) {
        key.draw(this.ctx);
      }
    });
  }
  
  drawKnightHealthBars() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Knight && enemy.knightStatusBar) {
        enemy.knightStatusBar.draw(this.ctx); // Draw knightStatusBar
      }
    });
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

 
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawStatusBars() {
    this.addToMap(this.poisonStatusBar); // Ensure the PoisonStatusBar is drawn
    this.addToMap(this.characterStatusBar); // Draw characterStatusBar
    this.characterStatusBar.draw(this.ctx);
    this.poisonStatusBar.draw(this.ctx); // Draw the PoisonStatusBar
    if (this.currentLevelIndex === 1 && this.level.endboss) {
      this.endbossHealthBar.x = this.level.endboss.x;
      this.endbossHealthBar.y = this.level.endboss.y - 50;
      this.addToMap(this.endbossHealthBar);
      this.endbossHealthBar.draw(this.ctx);
    }
    this.addToMap(this.character.healthBar);
  }

  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.enemies);
    this.poisonsArray.forEach((poison) => {
      poison.draw(this.ctx, this.camera_x);
    });
    this.throwableObjects.forEach((bottle) => {
      bottle.draw(this.ctx, this.camera_x);
    });
    this.ctx.translate(-this.camera_x, 0);
  }

  drawEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.draw(this.ctx);
      if (enemy instanceof Knight && enemy.comets) {
        // Check if enemy.comets exists
        enemy.comets.forEach((comet) => {
          comet.draw(this.ctx);
        });
      }
    });
    if (this.level === level2 && this.level.endboss) {
      // Draw endboss only in level 2
      this.level.endboss.draw(this.ctx);
    }
  }

  drawCharacter() {
    this.ctx.translate(this.camera_x, 0); // Draw camera-bound objects
    this.addToMap(this.character);
    this.characters.forEach((character) => character.draw(this.ctx));
    this.ctx.translate(-this.camera_x, 0); // Reset camera
  }

  handleMouseClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (
      x >= this.quitButton.x &&
      x <= this.quitButton.x + this.quitButton.width &&
      y >= this.quitButton.y &&
      y <= this.quitButton.y + this.quitButton.height
    ) {
    }
  }

  addObjectsToMap(objects) {
    if (objects && Array.isArray(objects)) {
      objects.forEach((object) => {
        this.addToMap(object);
      });
    } else {
      console.error("Objects is not an array or is undefined");
    }

    // Repeat the background if it disappears to the left of the viewport
    if (
      this.backgroundObjects.length > 0 &&
      this.camera_x >= this.backgroundObjects[0].width
    ) {
      this.camera_x = 0; // Reset the camera if the background has left the screen
    }
  }

  addToMap(mo) {
    if (mo && mo.otherDirection) {
      this.flipImage(mo); // Flip the image if necessary
    }
    if (mo) {
      mo.draw(this.ctx); // Draw the image
      mo.drawFrame(this.ctx); // Update the image
    }
    if (mo && mo.otherDirection) {
      this.flipImageBack(mo); // Flip the image back
    }
  }

  flipImage(mo) {
    this.ctx.save(); // Save the current state of the canvas
    this.ctx.translate(mo.width, 0); // Move the image by the width of the image
    this.ctx.scale(-1, 1); // Flip the image
    mo.x = mo.x * -1; // Rotate the image 180 degrees
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1; // Rotate the image 180 degrees back
    this.ctx.restore(); // Restore the saved state
  }

  checkThrowableObject() {
    if (this.keyboard.D && this.character.poisonCollected > 0) {
      this.character.throwObject();
      playPoisonBottleSound(); // Play sound when the bottle is thrown
    }
  }

  drawCollectables() {
    this.ctx.translate(this.camera_x, 0); // Draw camera-bound objects
    this.collectables.forEach((collectable) => collectable.draw(this.ctx));
    this.ctx.translate(-this.camera_x, 0); // Reset camera
  }

  checkCollisionsWithCollectables() {
    CollisionUtils.checkCollisionsWithCollectables(this.character, this.collectables, this.handleCollectable.bind(this));
  }

    handleCollectable(collectable) {
     if (collectable.type === 'poison') {
        this.character.collectPoison(collectable);
      } else if (collectable.type === 'key') {
        this.character.collectKey(collectable);
      }
    }
  
  checkDoorCollision() {
    const door = this.door; // Door from the current level
    if (this.character.checkCollisionWithDoor(door)) {
      this.character.enterDoor(); // Animation when entering the door
      setTimeout(() => {
        this.levelCompleted = true; // Mark the level as completed
        continueToNextLevel(); // Switch to level 2
      }, 2000); // Short delay before switching levels
    }
  }
}