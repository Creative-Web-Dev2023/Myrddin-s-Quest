class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  lastCloudSpawn = 0;
  cloudSpawnInterval = 3000;
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
  endbossHealthBar;
  crystal;

  constructor(canvas, keyboard, level1) {
    this.level = level1;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ui = new UI(canvas);
    this.initializeGameObjects();
    this.setWorld();
     this.collisionHandler = new CollisionHandler(this);
    this.drawer = new Drawer(this);
    if (this.level.endboss) {
      this.endbossHealthBar = this.level.endboss.statusBarEndboss;
    } else {
      this.endbossHealthBar = null;
    }
    this.endGame = new EndGame(this);
  }

  /**
   * Setzt die Welt des Spiels zurück.
   */
  resetGameWorld() {
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
    
    // Initialisiere Arrays
    this.poisonsArray = this.level.poisonObjects || [];
    this.backgroundObjects = this.level.backgroundObjects || [];
    this.traps = this.level.traps || [];
    this.enemies = [];
    this.snakes = [];
    
    // Füge Feinde zur richtigen Liste hinzu
    if (this.level.enemies) {
      this.level.enemies.forEach(enemy => {
        if (enemy instanceof Snake) {
          this.snakes.push(enemy);
        } else {
          this.enemies.push(enemy);
        }
        enemy.setWorld(this);
      });
    }
    
    this.level.objects = this.level.objects || [];
    this.loadImages(this.IMAGES_YOU_LOST);
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]);
    
    const cloudsArray = generateCloudsLvl();
    this.clouds = new Clouds(cloudsArray);
    this.door = this.level.door || [];
    this.key = this.level.key;
    this.crystal = this.level.crystal;
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
    if (this.crystal) {
      this.crystal.world = this;
    }
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
    this.clouds?.updateClouds();
    this.collisionHandler?.checkCollisions();   
    if (this.character.isVisible) {
      this.character.update();
      this.character.playAnimation(this.character.IMAGES_IDLE);
    }
    this.updateCollectibles(); 
    this.updateEnemies();
    if (this.level.endboss && !this.level.endboss.dead) {
      this.endbossHealthBar?.setPercentage(this.level.endboss.energy);
    }
  }
  /**
   * Aktualisiert alle Sammelobjekte (Gift, Schlüssel, Kristall).
   */
  updateCollectibles() {
    this.updatePoison();
    this.updateCrystal();
    this.updateKey();
  }

   updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (this.collisionHandler.isColliding(this.character, poison)) {
        this.character.collectPoison(poison, index);
      }
    });
  }

  /**
   * Aktualisiert den Zustand des Kristalls.
   */
updateCrystal() {
  if (this.crystal && this.crystal.isActive) {
    if (this.collisionHandler.isColliding(this.character, this.crystal)) {
      this.crystal.collect();
    }
  }
}

updateKey() {
  if (this.key && this.key.isActive) {
    if (this.collisionHandler.isColliding(this.character, this.key)) {
      this.character.collectKey(this.key);
    }
  }
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
    const allEnemies = [...this.enemies, ...this.snakes];
    for (let i = allEnemies.length - 1; i >= 0; i--) {
      const enemy = allEnemies[i];
      if (enemy.isRemoved) continue;
      if (enemy.isReadyToRemove) {
        this.removeEnemyFromWorld(enemy);
        continue;
      }
      if (!enemy.dead) {
        enemy.update(this.character);
      }
    }
  }

  removeEnemyFromWorld(enemy) {
  
    const lists = []; 
    if (enemy instanceof Snake) {
      lists.push(this.snakes, this.level?.snakes);
    } else {
      lists.push(this.enemies, this.level?.enemies);
    }
    lists.forEach(list => {
      if (Array.isArray(list)) {
        const index = list.indexOf(enemy);
        if (index > -1) {
          list.splice(index, 1);
          console.log(`Enemy ${enemy.id} removed from list`);
        }
      }
    });
    enemy.stopAllIntervals();
    enemy.isRemoved = true;
    enemy.isVisible = false;
 
    if (this.level?.endboss === enemy) {
      this.level.endboss = null;
    }
  }

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

  addToMap(mo) {
    if (!mo) return;
    if (mo instanceof Endboss) {
      if (mo.isActive !== false) mo.draw(this.ctx);
      return;
    }
    if (mo.otherDirection) this.flipImage(mo);
    if (mo.isActive !== false) mo.draw(this.ctx);
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
