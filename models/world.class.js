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
  tryAgainButtonImage = ["img/game_ui/try_again.png"];
  endGame;
  door;
  key;
  snakes = [];
  traps = [];
  environments = [];
  endbossHealthBar;
  crystal;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ui = new UI(canvas);
    this.initializeGameObjects();
    this.environments = generateEnvironmentsLvl();
    this.setWorld();
    this.collisionHandler = new CollisionHandler(this);
    this.drawer = new Drawer(this);
    this.initializeDoor();
    this.endbossHealthBar = new EndbossStatusbar();
    this.crystal = null;
    this.endGame = new EndGame(this);
  }

  /**
   * Initialisiert die Tür im Spiel.
   */
  initializeDoor() {
    if (!this.door) {
      this.door = new Door(4500, 150);
      this.door.world = this;
    }
  }

  /**
   * Setzt die Welt des Spiels zurück.
   */
  resetGameWorld() {
    this.characters = [];
    this.enemies = [];
    this.throwableObjects = [];
    this.imageCache = {};
    this.camera_x = 0;
    this.lastCloudSpawn = 0;
    this.cloudSpawnInterval = 3000;
    this.characterStatusBar = null;
    this.endbossHealthBar = null;
    this.crystal = null;
    this.door = null;
    this.key = null;
    this.snakes = [];
    this.traps = [];
    this.environments = [];
    this.endGame = null;
  }

  /**
   * Initialisiert die Spielobjekte.
   */
  initializeGameObjects() {
    this.level = level1;
    this.clouds = this.level.clouds || [];
    this.poisonStatusBar = new PoisonStatusBar();
    this.characterStatusBar = new StatusBar();
    this.character = new Character(this, this.poisonStatusBar);
    this.character.world = this;
    this.poisonsArray = PoisonObject.initializePoisons();
    this.environments = generateEnvironmentsLvl();
    this.backgroundObjects = this.level.backgroundObjects || [];
    this.traps = this.level.traps || [];
    this.enemies = this.level.enemies || [];
    this.level.objects = this.level.objects || [];
    this.loadImages(this.IMAGES_YOU_LOST);
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]);
    this.door = new Door(4500, 80);
    this.key = Key.initializeKey();
    this.camera_x = this.character.x - 190;
    this.endGame = new EndGame(this);
  }

  /**
   * Setzt die Welt des Spiels.
   */
  setWorld() {
    this.character.world = this;
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Enemy) {
        enemy.setWorld(this);
      }
    });
    if (this.door) {
      this.door.world = this;
    }
    if (this.key) {
      this.key.world = this;
    }
    this.traps.forEach((trap) => {
      trap.world = this;
    });

    this.camera_x = -this.character.x - 190;
  }

  /**
   * Lädt die angegebenen Bilder.
   * @param {string[]} images - Die zu ladenden Bilder.
   */
  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Aktualisiert den Zustand der Welt.
   */
  update() {
    if (this.levelCompleted || this.character.energy <= 0) return;
    if (this.collisionHandler) {
      this.collisionHandler.checkCollisions();
    }
    if (this.character.isVisible) {
      this.character.update();
      this.character.playAnimation(this.character.IMAGES_IDLE); // Beispiel für die Verwendung der playAnimation-Methode
    }
    this.updatePoison();
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound();
    }
    if (this.character.energy <= 0 && !this.levelCompleted && !isDead) {
      this.endGame.checkDeathCondition();
    }
    this.updateEnemies();
    if (this.level.endboss) {
      this.endbossHealthBar.setPercentage(this.level.endboss.energy);
    }
  }

  /**
   * Aktualisiert die Feinde in der Welt.
   */
  updateEnemies() {
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss || enemy instanceof Snake) {
        enemy.update(this.character);
      }
    });
  }

  /**
   * Aktualisiert den Zustand des Gifts.
   */
  updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (this.collisionHandler.checkCollision(this.character, poison)) {
        this.character.collectPoison(poison, index);
      }
    });
  }

  /**
   * Fügt einen Charakter zur Welt hinzu.
   * @param {Character} character - Der hinzuzufügende Charakter.
   */
  addCharacter(character) {
    this.characters.push(character);
  }

  /**
   * Fügt einen Feind zur Welt hinzu.
   * @param {Enemy} enemy - Der hinzuzufügende Feind.
   */
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  /**
   * Zeichnet die Welt.
   */
  draw() {
    this.clearCanvas();
    if (this.drawer) {
      this.drawer.draw();
    }
    this.drawThrowableObjects();
    this.drawTraps();
    this.drawEndbossGuardRange();
  }

  /**
   * Zeichnet die werfbaren Objekte.
   */
  drawThrowableObjects() {
    this.throwableObjects.forEach((obj) => {
      obj.draw(this.ctx);
      if (obj.isColliding(this.level.endboss)) {
        this.updateEndbossHealth(obj.damage);
        this.characterStatusBar.update(this.character.energy);
        obj.deactivate();
      }
    });
  }

  /**
   * Zeichnet die Fallen.
   */
  drawTraps() {
    this.traps.forEach((trap) => {
      trap.draw(this.ctx);
    });
  }

  /**
   * Zeichnet den Wachbereich des Endbosses.
   */
  drawEndbossGuardRange() {
    if (this.level.endboss) {
      this.level.endboss.drawGuardRange(this.ctx);
    }
  }

  /**
   * Löscht das Canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Fügt Objekte zur Karte hinzu.
   * @param {MovableObject[]} objects - Die hinzuzufügenden Objekte.
   */
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

  /**
   * Fügt ein Objekt zur Karte hinzu.
   * @param {MovableObject} mo - Das hinzuzufügende Objekt.
   */
  addToMap(mo) {
    if (mo && mo.otherDirection) {
      this.flipImage(mo);
    }
    if (mo && mo.isActive !== false) {
      mo.draw(this.ctx);
      mo.drawFrame(this.ctx);
    }
    if (mo && mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt das Bild eines Objekts.
   * @param {MovableObject} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Setzt das Bild eines Objekts zurück.
   * @param {MovableObject} mo - Das zurückzusetzende Objekt.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  resetCamera() {
    this.camera_x = -this.character.x + 190;
  }
}
