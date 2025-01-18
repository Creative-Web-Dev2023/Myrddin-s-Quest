class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastCloudSpawn = 0;
  cloudSpawnInterval = 3000;
  characterStatusBar;
  characters = [];
  enemies = [];
  throwableObjects = [];
  imageCache = {};
  IMAGES_YOU_LOST = ["img/game_ui/login&pass/game_over.png"];
  quitButton;
  quitButtonImage = "img/game_ui/quit.png";
  tryAgainButton;
  tryAgainButtonImage = "img/game_ui/try_again.png";
  levelCompleted = false;
  collectables = [];
  key;
  endGame;
  door;
  snakes = [];
  traps = [];
  
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ui = new UI(canvas);
    this.initializeGameObjects();
    this.environments = generateEnvironmentsLvl();
    this.key = this.environments.find((obj) => obj instanceof Key);
    this.setWorld();
    this.collisionHandler = new CollisionHandler(this);
    this.drawer = new Drawer(this);
    this.gameLoop = new GameLoop(this);
    this.gameLoop.start();
    if (!this.door) {
      this.door = new Door(4500, 150);
      this.door.world = this;
    }
  }

  initializeGameObjects() {
    this.level = level1;
    this.clouds = this.level.clouds || [];
    this.poisonStatusBar = new PoisonStatusBar();
    this.characterStatusBar = new StatusBar();
    this.character = new Character(this, this.poisonStatusBar);
    this.character.world.keyboard = this.keyboard;
    this.poisonsArray = PoisonObject.initializePoisons();
    this.key = this.level.key;
    this.backgroundObjects = this.level.backgroundObjects || [];
    this.traps = this.level.traps || [];
    this.enemies = this.level.enemies || [];
    this.level.objects = this.level.objects || [];
    this.loadImages(this.IMAGES_YOU_LOST);
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]);
    this.door = this.level.door;
    this.camera_x = -this.character.x - 190;
    this.endGame = new EndGame(this);
  }

  setWorld() {
    this.character.world = this;
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Enemy) { 
        enemy.setWorld(this); 
        enemy.otherDirection = true;
      } else {
        console.error("Non-Enemy object found in enemies array:", enemy);
      }
    });
    if (this.door) { 
      this.door.world = this; 
    }
    if (this.key) {
      this.key.world = this;
    }
    this.traps.forEach(trap => {
      trap.world = this; 
    });
    if (this.level.endboss) {
      this.level.endboss.world = this;
    }
    // Setzen Sie die Kamera-Position basierend auf dem aktuellen Level
    this.camera_x = -this.character.x - 190;
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  update() {
    if (this.levelCompleted || this.character.energy <= 0) return;
    if (this.collisionHandler) {
      this.collisionHandler.checkCollisions();
    }
    this.character.update();
    this.updatePoison();
    this.character.checkThrowableObject();
    this.updateThrowableObjects();
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound();
    }
    if (this.character.energy <= 0 && !this.levelCompleted) {
      setTimeout(() => {
        this.endGame.showYouLostScreen();
      }, 200);
    }
    this.character.handleActions();

    this.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss || enemy instanceof Snake) {
        enemy.update(this.character);
      }
    });

  }

  updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (this.collisionHandler.checkCollision(this.character, poison)) {
        this.character.collectPoison(poison, index);
      }
    });
  }

  updateThrowableObjects() {
    this.throwableObjects.forEach((obj) => {
      obj.update();
    });
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
    console.log(
      `Feind hinzugefügt: ${enemy.constructor.name}, ID: ${enemy.id}`
    );
  }

  draw() {
    if (this.drawer) {
      this.drawer.draw();
    }
    this.throwableObjects.forEach((obj) => {
      obj.draw(this.ctx);
    });
    this.traps.forEach((trap) => {
      console.log(`Trap position: x=${trap.x}, y=${trap.y}`); // Log die Position der Fallen
      trap.draw(this.ctx); // Zeichne die Fallen
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addObjectsToMap(objects) {
    if (objects && Array.isArray(objects)) {
      objects.forEach((object) => {
        this.addToMap(object);
      });
    }
    if (
      this.backgroundObjects.length > 0 &&
      this.camera_x >= this.backgroundObjects[0].width
    ) {
      this.camera_x = 0;
    }
  }

  addToMap(mo) {
    if (mo && mo.otherDirection) {
      this.flipImage(mo);
    }
    if (mo) {
      mo.draw(this.ctx);
      mo.drawFrame(this.ctx);
    }
    if (mo && mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}