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
    key; // Array for keys
    endGame; // EndGame class attribute
    door; // Door attribute
    snakes = []; // Array for snakes
    traps = []; // Initialisiere das Array für Fallen
    constructor(canvas, keyboard) {
      this.ctx = canvas.getContext("2d"); // Get the canvas context
      this.canvas = canvas; // Set the canvas
      this.keyboard = keyboard; // Set the keyboard input
      this.ui = new UI(canvas); // Initialize UI
      this.initializeGameObjects(); // Initialize game objects before setting the world
      this.setWorld();
      this.collisionHandler = new CollisionHandler(this); // Initialize collisionHandler before gameLoop
      this.drawer = new Drawer(this); // Initialize drawer before gameLoop
      this.gameLoop = new GameLoop(this);
      this.gameLoop.start();
    }

    initializeGameObjects() {
      this.level = this.levels[this.currentLevelIndex]; // Initialize the first level
      this.clouds = new Clouds(this.level.clouds); // Initialize the Clouds class
      this.clouds.randomizePositions(); // Set random positions for the clouds
      this.poisonStatusBar = new PoisonStatusBar(); // Initialize the poison status bar
      this.characterStatusBar = new StatusBar(); // Initialize the character status bar
      this.character = new Character(this, this.poisonStatusBar); // Initialize character with parameters
      this.character.world.keyboard = this.keyboard; // Forward keyboard to character
      this.poisonsArray = PoisonObject.initializePoisons(); // Initialize poison objects
      this.key = Key.initializeKey(); // Initialize the key
      this.backgroundObjects = this.level.backgroundObjects || []; // Ensure it is an array
      this.enemies = this.level.enemies || []; // Initialize enemies from the level
      this.level.objects = this.level.objects || []; // Ensure objects is an array
      this.level.clouds = this.level.clouds || []; // Ensure clouds is an array
      this.loadImages(this.IMAGES_YOU_LOST); // Load the "You Lost" image
      this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]); // Load the button images
      this.door = new Door(1000, 200); // Initialize the door with a position
      this.traps = this.level.traps || []; // Initialize traps from the current level
      this.camera_x = -this.character.x - 190; // Set the camera to the character's starting position
      this.endGame = new EndGame(this); // Initialize the EndGame class
    }

    setWorld() {
      this.character.world = this;
      this.enemies.forEach((enemy) => {
        if (enemy instanceof Enemy) { 
          enemy.setWorld(this); 
          enemy.otherDirection = true; 
          console.log(`Feind hinzugefügt: ${enemy.constructor.name} mit ID: ${enemy.id}`); // Debugging
        }
      });
      if (this.door) { 
        this.door.world = this; 
      }
      this.traps.forEach(trap => {
        trap.world = this; 
      });
    }

    loadImages(images) { 
      images.forEach((path) => { 
        const img = new Image();  
        img.src = path; 
        this.imageCache[path] = img; 
      });
    }
    
    update() {
      if (this.levelCompleted || this.character.energy <= 0) return; // Stop updating if the character is dead
      if (this.collisionHandler) { // Check if collisionHandler is defined
        this.collisionHandler.checkCollisions();
      }
      this.character.update();
      this.updatePoison();
      this.character.checkThrowableObject(); // Call the method of the Character class
      if (this.character.isMoving() && musicIsOn) {
          playWalkingSound();
      }
      if (this.character.energy <= 0 && !this.levelCompleted) {
          setTimeout(() => {
              this.endGame.showYouLostScreen();
          }, 200);
      }
      this.character.handleActions(); // Ensure handleActions is called
      this.collisionHandler.checkDoorCollision(); // Add this call
      this.enemies.forEach(enemy => {
        if (enemy instanceof Endboss || enemy instanceof Snake) {
          enemy.update(this.character); // Endboss und Snake prüfen, ob sie angreifen sollen
        }
      });
    }

    updatePoison() { // Update the poison objects 
      this.poisonsArray.forEach((poison, index) => { // Iterate over the poison objects
        if (this.collisionHandler.checkCollision(this.character, poison)) { // Verwenden Sie die Methode der CollisionHandler-Klasse
          this.character.collectPoison(poison, index); // Collect the poison
        }
      });
    }
   
    addCharacter(character) {
      this.characters.push(character); // Add a character to the array
    }
    addEnemy(enemy) {
      this.enemies.push(enemy); // Add an enemy to the array
    }
    draw() {
      if (this.drawer) { // Check if drawer is defined
          this.drawer.draw();
      }
    }
   
    clearCanvas() { // Clear the canvas 
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    }

    addObjectsToMap(objects) { // Add objects to the map 
      if (objects && Array.isArray(objects)) { // Check if objects is an array and exists 
        objects.forEach((object) => { // Iterate over the objects 
          this.addToMap(object); // Add objects to the map
        });
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
    
    loadLevel2() {
      if (typeof level2 !== 'undefined') {
          world.level = level2;
          world.backgroundObjects = level2.backgroundObjects;
          world.enemies = level2.enemies;
          world.enemies.forEach(enemy => {
              if (enemy instanceof Snake) {
                  enemy.setWorld(this);
                  enemy.otherDirection = true; // Schlange schaut nach links
                  enemy.speedX = -enemy.speedX; // Schlange bewegt sich nach links
                  enemy.direction = 'left'; // Setze die Richtung auf 'links'
              }
          });
      }
    }
  }
