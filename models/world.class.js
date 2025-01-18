class World {
  character;
  level = level1;
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
  levels = [level1, level2]; // Fügen Sie level2 zur levels-Liste hinzu
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
  endboss;
  enemies = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = this.levels[this.currentLevelIndex]; // Initialisiere das Level
    if (!this.level) {
      console.error("Fehler: Level ist undefined.");
      return;
    }
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
    this.level = this.levels[this.currentLevelIndex]; // Falls mehrere Level existieren
    if (!this.level) {
      console.error("Fehler: Level ist undefined.");
      return;
    }
    this.clouds = this.level.clouds || [];
    this.poisonStatusBar = new PoisonStatusBar();
    this.characterStatusBar = new StatusBar();
    this.character = new Character(this, this.poisonStatusBar);
    this.character.world.keyboard = this.keyboard;
    this.poisonsArray = PoisonObject.initializePoisons();
    this.key = this.level.key;
    this.backgroundObjects = this.level.backgroundObjects || [];
    
    this.initializeEnemies();
    this.initializeTraps();  // Hier werden die Traps geladen
    this.initializeEndboss();
    this.initializeOtherObjects();
    this.updateEnemiesList();
  }

  initializeEnemies() {
    this.level.enemies.forEach(enemyData => {
        if (!enemyData) {
            return;
        }
        let enemy;
        if (enemyData instanceof Knight) {
          enemy = new Knight(0, enemyData.x, 100, enemyData.id);
        } else if (enemyData instanceof Snake) {
            enemy = new Snake(enemyData.x, enemyData.y, enemyData.id);
        }
        if (enemy) {
            this.enemies.push(enemy);
            enemy.setWorld(this); // Welt für den Gegner setzen
        }
    });
  }

  initializeEndboss() {
    if (this.level === level2) {
      this.endboss = generateEndbossLvl2();
      if (this.endboss) {
        this.endboss.setWorld(this);
        console.log("Endboss initialisiert:", this.endboss);
      } else {
        console.error("Fehler: Endboss konnte nicht initialisiert werden.");
      }
    }
  }

  initializeTraps() {
    if (!this.level.traps || this.level.traps.length === 0) {
        return;
    }
    this.traps = [...this.level.traps];
    this.traps.forEach(trap => {
        trap.setWorld(this);
        console.log("Trap initialisiert:", trap);
    });
    console.log("Traps erfolgreich geladen:", this.traps);
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
    if (this.level.endboss) {
        this.level.endboss.setWorld(world); 
    }
    this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Enemy) {
            enemy.setWorld(world);
            enemy.otherDirection = true;
        }
    });
    if (this.level && this.level.traps) {
        this.level.traps.forEach(trap => trap.setWorld(world));
    }
    if (this.door) {
        this.door.world = this;
    }
    if (this.key) {
        this.key.world = this;
    }
  }

  updateEnemiesList() {
    this.enemies = this.enemies.filter(enemy => !enemy.isRemoved);
    this.snakes = this.enemies.filter(enemy => enemy instanceof Snake);
    this.knights = this.enemies.filter(enemy => enemy instanceof Knight);
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
    if (this.level && this.level.traps) {
      this.level.traps.forEach((trap) => {
        trap.draw(this.ctx);
      });
    }
    if (this.endboss) {
      console.log("Endboss wird gezeichnet:", this.endboss);
      this.endboss.draw(this.ctx);
    } 
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
    this.enemies = [...this.knights, ...this.snakes, ...this.endboss];
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

function generateEndbossLvl2() {
  const someEndbossObject = new Endboss(); // Beispiel für die Erzeugung des Endboss-Objekts
  console.log("Endboss generiert:", someEndbossObject); // Debugging
  return someEndbossObject; // Stelle sicher, dass ein gültiges Endboss-Objekt zurückgegeben wird
}
