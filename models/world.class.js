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
  currentLevelIndex = 0;
  levels = [level1];
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
  knights = [];
  traps = [];
  endboss = null;
  enemies = [...this.knights, ...this.snakes, ...this.traps];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.enemies = []; // Initialisiere die enemies-Liste als leeres Array
    this.ui = new UI(canvas);
    this.initializeGameObjects();
    this.environments = generateEnvironmentsLvl1();
    this.key = this.environments.find((obj) => obj instanceof Key);
    this.setWorld(this); // Stellen Sie sicher, dass die Welt korrekt gesetzt wird
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
    this.level = this.levels[this.currentLevelIndex];
    this.clouds = this.level.clouds || [];
    this.poisonStatusBar = new PoisonStatusBar();
    this.characterStatusBar = new StatusBar();
    this.character = new Character(this, this.poisonStatusBar);
    this.character.world.keyboard = this.keyboard;
    this.poisonsArray = PoisonObject.initializePoisons();
    this.key = this.level.key;
    this.backgroundObjects = this.level.backgroundObjects || [];
    this.initializeEnemies();
    this.initializeTraps();
    this.initializeEndboss(); // Sicherstellen, dass der Endboss initialisiert wird
    this.initializeOtherObjects();
    this.updateEnemiesList();
  }

  initializeEnemies() {
    this.enemies = this.level.enemies || [];
    this.snakes = this.level.enemies.filter(enemy => enemy instanceof Snake);
    this.knights = this.level.enemies.filter(enemy => enemy instanceof Knight);
    console.log("Endboss in initializeEnemies:", this.level.enemies.find(enemy => enemy instanceof Endboss));
  }
  initializeEndboss() {
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (this.endboss) {
        console.log("Endboss gefunden:", this.endboss);
        this.enemies.push(this.endboss);
        this.endboss.setWorld(this);
    } else {
        console.warn("Kein Endboss gefunden in der Feindliste!");
    }
}

  initializeTraps() {
    this.traps = this.level.traps || [];
    this.traps.forEach(trap => trap.setWorld(this));
  }

  initializeEndboss() {
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (this.endboss) {
        console.log("Endboss gefunden:", this.endboss);
        this.enemies.push(this.endboss);
        this.endboss.setWorld(this); // Endboss die Welt zuweisen
    } else {
        console.warn("Kein Endboss gefunden in der Feindliste!");
    }
  }

  initializeOtherObjects() {
    this.level.objects = this.level.objects || [];
    this.level.clouds = this.level.clouds || [];
    this.loadImages(this.IMAGES_YOU_LOST);
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]);
    this.door = this.level.door;
    this.camera_x = -this.character.x - 190;
    this.endGame = new EndGame(this);
    this.level.enemies = this.level.enemies || [];
  }

  setWorld(world) {
    if (!world.enemies) {
        world.enemies = [];
    }
    this.character.world = world;
    this.updateEnemiesList();
    if (this.endboss) {
        if (!world.enemies.includes(this.endboss)) {
            world.enemies.push(this.endboss);
        }
        this.endboss.setWorld(world); // Endboss die Welt zuweisen
    }
    this.enemies.forEach((enemy) => {
        if (enemy instanceof Enemy) {
            enemy.setWorld(world);
            enemy.otherDirection = true;
        }
    });
    this.traps.forEach(trap => trap.setWorld(world));
    if (this.door) {
        this.door.world = this;
    }
    if (this.key) {
        this.key.world = this;
    }
}


  updateEnemiesList() {
    this.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
    this.snakes = this.enemies.filter(enemy => enemy instanceof Snake);
    this.knights = this.enemies.filter(enemy => enemy instanceof Knight);
    this.traps = this.level.traps || [];
    this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    if (this.endboss) {
        console.log("Endboss in updateEnemiesList:", this.endboss);
    } else {
        console.warn("Kein Endboss gefunden in der Feindliste!");
    }
    this.level.enemies = [...this.knights, ...this.snakes, ...this.traps];
    this.enemies = [...this.knights, ...this.snakes, ...this.traps];
    if (this.endboss) {
        this.enemies.push(this.endboss);
    }
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

    this.updateEnemiesList();
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

  updateThrowableObjects(objects) {
    this.throwableObjects.forEach((obj) => {
      obj.update();
    });
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  addEnemy(enemy) {
    this.level.enemies.push(enemy); 
    this.updateEnemiesList();
  }

  draw() {
    if (this.drawer) {
      this.drawer.draw();
    }
    this.throwableObjects.forEach((obj) => {
      obj.draw(this.ctx);
    });
    this.traps.forEach((trap) => {
      trap.draw(this.ctx);
    });
    if (this.endboss) {
      this.endboss.draw(this.ctx);
    }
    console.log("Endboss in draw:", this.endboss); // Debugging
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

  loadNextLevel() {
    this.clearEnemies(); // Entferne alle alten Gegner
    this.currentLevelIndex++;
    if (this.currentLevelIndex >= this.levels.length) {
      this.currentLevelIndex = 0; // Zurück zum ersten Level
    }
    this.level = this.levels[this.currentLevelIndex];
    this.initializeGameObjects(); // Neue Gegner hinzufügen
    this.setWorld();
    
  }

  clearEnemies() {
    this.enemies.forEach(enemy => enemy.isRemoved = true); // Markiere alle alten Gegner als entfernt
    this.enemies = []; // Leere die Gegnerliste
  }

  updateEnemies() {
    this.enemies = [...this.knights, ...this.snakes, ...this.traps];
    if (this.endboss) {
      this.enemies.push(this.endboss);
    }
    this.enemies.forEach((enemy) => {
      if (typeof enemy.update === 'function') {
        enemy.update();
      }
    });
  }
}
