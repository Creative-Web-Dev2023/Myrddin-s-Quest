class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastCloudSpawn = 0;
  cloudSpawnInterval = 3000;
  // characterStatusBar;
  characters = [];
  enemies = [];
  throwableObjects = [];
  imageCache = {};
  IMAGES_YOU_LOST = ["./assets/img/game_ui/login&pass/game_over.png"];
  quitButton;
  quitButtonImage = "./assets/img/game_ui/quit.png";
  tryAgainButton;
  tryAgainButtonImage = ["./assets/img/game_ui/try_again.png"];
  endGame;
  door = [];
  key;
  clouds = [];
  snakes = [];
  traps = [];
  // environments = [];
  endbossHealthBar;
  crystal;

  constructor(canvas, keyboard, level1) {
    this.level = level1;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ui = new UI(canvas);
    this.initializeGameObjects();
    // this.environments = generateEnvironmentsLvl();
    this.setWorld();
    this.collisionHandler = new CollisionHandler(this);
    this.drawer = new Drawer(this);
    // this.initializeDoor(); // LÖSCHEN!!
    this.endbossHealthBar = new EndbossStatusbar();
    this.endGame = new EndGame(this);
  }

  /**
   * LÖSCHEN!!
   */
  /*   initializeDoor() {
    if (!this.door) {
      this.door = new Door(4500, 150);
      this.door.world = this;
    }
  } */

  /**
   * Setzt die Welt des Spiels zurück.
   */
  resetGameWorld() {
    // this.characters = []; // wird nicht genutzt
    this.enemies = [];
    this.throwableObjects = [];
    this.imageCache = {};
    this.camera_x = 0;
    this.lastCloudSpawn = 0;
    this.cloudSpawnInterval = 3000;
    this.characterStatusBar = null;
    this.endbossHealthBar = null;
    this.door = [];
    this.key = null;
    this.snakes = [];
    this.traps = [];
    this.clouds = [];
    this.poisons = [];
    // this.environments = [];
    this.endGame = null;
  }

  /**
   * Initialisiert die Spielobjekte.
   */
  initializeGameObjects() {
    this.poisonStatusBar = new PoisonStatusBar();
    this.characterStatusBar = new StatusBar();
    this.character = new Character(this, this.poisonStatusBar);
    this.character.world = this;
    this.character.y = 150;
    this.poisonsArray = this.level.poisonObjects || [];
    console.log("[World] Initialized Poison Objects:", this.poisonsArray);
    this.backgroundObjects = this.level.backgroundObjects || [];
    this.traps = this.level.traps || [];
    this.enemies = this.level.enemies || [];
    this.level.objects = this.level.objects || [];
    this.snakes = this.level.snakes || [];
    this.loadImages(this.IMAGES_YOU_LOST);
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]);
    const cloudsArray = generateCloudsLvl(); // Wolken-Array erstellen
    this.clouds = new Clouds(cloudsArray); // Clouds-Instanz mit Wolken initialisieren
    console.log("[World] Wolken initialisiert:", this.clouds.clouds); // Debug-Log
    this.door = this.level.door || [];
    this.key = this.level.key;
    this.crystal = this.level.crystal;

    console.log("Level-Door:", this.level.door);
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

    if (this.clouds) {
      this.clouds.updateClouds();
      console.log("[Clouds] Wolken-Array:", this.clouds);
    }

    if (this.collisionHandler) {
      this.collisionHandler.checkCollisions();
    }
    if (this.character.isVisible) {
      this.character.update();
      this.character.playAnimation(this.character.IMAGES_IDLE);
    }
    this.updatePoison();
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound();
    }
    this.updateKey();
    this.updateEnemies();
    if (this.level.endboss) {
      this.endbossHealthBar.setPercentage(this.level.endboss.energy);
    }
    this.updateCrystal();
  }

  /**
   * Zeichnet die Welt.
   */
  draw() {
    this.drawer.draw();
  }

  /**
   * Aktualisiert die Feinde in der Welt.
   */
  updateEnemies() {
    this.enemies.forEach((enemy) => {
      if (enemy instanceof Snake) {
        enemy.update(this.character);

        // Prüfen, ob der Charakter mit der Schlange kollidiert
        if (this.collisionHandler.checkCollision(this.character, enemy)) {
          enemy.takeDamage(0, this.character); // Schaden 0, wenn der Charakter springt
        }
      } else if (enemy instanceof Endboss) {
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
   * Aktualisiert den Zustand des Kristalls.
   */
  updateCrystal() {
    if (this.crystal && this.crystal.isActive) {
      if (this.collisionHandler.checkCollision(this.character, this.crystal)) {
        this.crystal.collect();
      }
    }
  }

  updateKey() {
    if (this.key && this.key.isActive) {
      if (this.collisionHandler.checkCollision(this.character, this.key)) {
        this.character.collectKey(this.key);
        console.log("🔑 Schlüssel eingesammelt");
      }
    }
  }

  /**
   * Fügt einen Charakter zur Welt hinzu.
   * @param {Character} character - Der hinzuzufügende Charakter.
   */
  /* WIRD NICHT GENUTZT! */
  /*   addCharacter(character) {
    this.characters.push(character);
  } */

  /**
   * Fügt einen Feind zur Welt hinzu.
   * @param {Enemy} enemy - Der hinzuzufügende Feind.
   */
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  /**
   * Löscht das Canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Fügt Objekte zum Canvas hinzu.
   * @param {MovableObject[]} objects - Die hinzuzufügenden Objekte.
   */
  /*   addObjectsToMap(objects) {
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
  } */

  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) {
      console.warn("[addObjectsToMap()] kein Array übergeben:", objects);
      return;
    }

    objects.forEach((object, i) => {
      if (!object) {
        console.warn(`[addObjectsToMap()] Objekt an Index ${i} ist undefined`);
      }
      this.addToMap(object);
    });

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
  /*   addToMap(mo) {
    if (mo && mo.otherDirection) {
      this.flipImage(mo);
    }
    if (mo && mo.isActive !== false) {
      mo.draw(this.ctx);
    }
    if (mo && mo.otherDirection) {
      this.flipImageBack(mo);
    }
  } */

  addToMap(mo) {
    if (!mo) {
      console.warn("[addToMap()] mo ist undefined oder null!");
      console.trace(); // <-- zeigt dir, woher der Aufruf kam!
      return;
    }

    if (mo.otherDirection) this.flipImage(mo);

    if (mo.isActive !== false) {
      try {
        mo.draw(this.ctx);
      } catch (err) {
        console.error(
          `[addToMap()] Fehler beim Zeichnen von ${mo.constructor?.name}:`,
          err
        );
      }
    }

    if (mo.otherDirection) this.flipImageBack(mo);
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

  /**
   * Setzt alle Feinde auf ihre ursprünglichen Positionen zurück.
   */
  resetEnemies() {
    this.enemies.forEach((enemy) => {
      if (enemy.resetPosition) {
        enemy.resetPosition();
      }
    });
  }

  /**
   * Stellt die Feinde aus dem gespeicherten Zustand wieder her.
   * @param {Array} enemies - Die gespeicherten Feind-Daten.
   */
  restoreEnemies(enemies) {
    this.enemies = enemies.map((data) => {
      const enemy = new (window[data.type] || Enemy)();
      Object.assign(enemy, data);
      return enemy;
    });
  }

  /**
   * Setzt alle Objekte auf ihre ursprünglichen Positionen zurück.
   */
  resetObjects() {
    if (!this.objects || !Array.isArray(this.objects)) {
      console.warn("Keine Objekte zum Zurücksetzen vorhanden."); // Debugging-Log
      return;
    }
    this.objects.forEach((obj) => {
      if (obj.resetPosition) {
        obj.resetPosition();
      }
    });
  }

  /**
   * Stellt die Objekte aus dem gespeicherten Zustand wieder her.
   * @param {Array} objects - Die gespeicherten Objekt-Daten.
   */
  restoreObjects(objects) {
    this.objects = objects.map((data) => {
      const obj = new GameObject();
      Object.assign(obj, data);
      return obj;
    });
  }
}
