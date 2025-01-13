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
      this.character.world = this; // Set the world property for the character
      this.enemies.forEach((enemy) => { // Iterate over the enemies
        if (enemy instanceof Knight || enemy instanceof Endboss) { // Check if the enemy is a knight or endboss
          enemy.world = this; // Set the world property for the knight or endboss
          enemy.otherDirection = true; // Ensure the knight or endboss always faces left
        }
      });
      if (this.door) { // Check if the door exists
        this.door.world = this; // Set the world property for the door
      }
      this.traps.forEach(trap => {
        trap.world = this; // Setze die Welt für jede Falle
      });
    }

    
    loadImages(images) { // Load images into the image cache
      images.forEach((path) => { // Iterate over the image paths
        const img = new Image(); // Create a new image object 
        img.src = path; // Set the source of the image
        this.imageCache[path] = img; // Store the image in the cache
      });
    }
    
  
    update() {
      if (this.levelCompleted || this.character.energy <= 0) return; // Stoppe die Aktualisierung, wenn der Charakter tot ist
      if (this.collisionHandler) { // Check if collisionHandler is defined
        this.collisionHandler.checkCollisions();
      }
      this.character.update();
      this.updatePoison();
      this.character.checkThrowableObject(); // Rufen Sie die Methode der Character-Klasse auf
      if (this.character.isMoving() && musicIsOn) {
          playWalkingSound();
      }
      if (this.character.energy <= 0 && !this.levelCompleted) {
          setTimeout(() => {
              this.endGame.showYouLostScreen();
          }, 200);
      }
      if (this.keyboard.ATTACK) {
          this.character.attackEnemies(); // Verwenden Sie attackEnemies anstelle von attackKnights
          this.character.playAnimation(this.character.IMAGES_ATTACK);
      }
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
  
    checkCollisions() {
      this.snakes.forEach(snake => {
        if (this.character.isColliding(snake)) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      });
    }
  
    checkFireAttackOnSnakes() {
      console.log("checkFireAttackOnSnakes called"); // Debugging-Ausgabe
      this.snakes.forEach((snake) => {
        const distance = Math.abs(this.character.x - snake.x);
        console.log(`Distance to snake: ${distance}`);
        if (snake.isDead()) {
          console.log("Snake is already dead");
          return;
        }
        if (distance < 300) { // Angriff nur wenn Schlange in Reichweite
          console.log("Fire attack hits snake!");
          snake.takeFireDamage(20); // Schaden für Feuerball
        } else {
          console.log("Snake is out of range");
        }
      });
    } 
  }
