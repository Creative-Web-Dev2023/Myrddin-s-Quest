class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // die Kamera wird um 100 nach links verschoben
  lastCloudSpawn = 0; // Zeitpunkt, an dem die letzte Wolke erzeugt wurde
  cloudSpawnInterval = 3000; // Intervall (3 Sekunden)
  coinsArray = [];
  poisonsArray = [];
  coinStatusBar; // Hier als Klassenattribut definiert
  statusBar; // Add statusBar as a class attribute
  characters = [];
  enemies = [];
  endbossHealthBar; // Füge eine Statusleiste für den Endboss hinzu
  throwableObjects = []; // Füge ein werfbares Objekt hinzu
  currentLevelIndex = 0; // Aktuelles Level
  levels = [level1, level2]; // Liste der Levels

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.keyboard.T = false; // Initialisiere die T-Taste
    this.keyboard.D = false; // Initialisiere die D-Taste
    this.level = this.levels[this.currentLevelIndex]; // Initialisiere das erste Level
    this.coinStatusBar = new CoinStatusBar(); // Instanz hier erstellen
    if (this.currentLevelIndex === 1) {
      this.poisonStatusBar = new PoisonStatusbar(); // Nur in Level 2 erstellen
    }
    this.statusBar = new Statusbar(); // Instanz hier erstellen
    this.character = new Character(this, this.coinStatusBar, this.poisonStatusBar); // Initialize character with parameters
    this.character.world.keyboard = this.keyboard; // Keyboard an den Character weiterleiten
    this.coinsArray = this.initializeCoins();
    this.poisonsArray = this.level.poisonObjects; // Initialisiere Giftobjekte
    this.backgroundObjects = this.level.backgroundObjects || []; // Sicherstellen, dass es ein Array ist
    this.enemies = this.level.enemies || []; // Sicherstellen, dass es ein Array ist
    this.endbossHealthBar = new Statusbar(); // Instanz hier erstellen
  
    this.setWorld();
    this.startGameLoop();
  }

  setWorld() {
    this.character.world = this;                                                                                                                                                                                                                                                                      
  }

  initializeCoins() {
    const coins = [];
    const coinSpacing = 100; // Abstand zwischen den Münzen
    const startX1 = 950; // Startposition der ersten Münzengruppe
    const startY1 = 300; // Y-Position der ersten Münzengruppe
    const startX2 = 3000; // Startposition der zweiten Münzengruppe (weiter entfernt)
    const startY2 = 300; // Y-Position der zweiten Münzengruppe
    const arcHeight = 100; // Höhe des Bogens

    for (let i = 0; i < 10; i++) { // Anzahl der Münzen pro Gruppe
      const x1 = startX1 + i * coinSpacing;
      const y1 = startY1 - Math.sin((i / 9) * Math.PI) * arcHeight; // Berechne die Y-Position für den Bogen
      coins.push(new Coin(x1, y1));

      const x2 = startX2 + i * coinSpacing;
      const y2 = startY2 - Math.sin((i / 9) * Math.PI) * arcHeight; // Berechne die Y-Position für den Bogen
      coins.push(new Coin(x2, y2));
    }

    return coins;
  }

  startGameLoop() {
    const gameLoop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  update() {
    this.checkCollisionsWithEnemy();
    this.character.update();
    this.updateCoins();
    this.updatePoison();
    this.addCloudsWhenCharacterMoves();
    this.checkCollisionsWithEndboss();
    this.updateEndbossHealth();
    this.updateKnightHealthBars(); // Fügen Sie diese Zeile hinzu
    this.checkThrowableObject(); // Überprüfen, ob eine Flasche geworfen werden soll
    this.checkLevelCompletion(); // Überprüfe, ob das Level abgeschlossen ist
  }

  updateKnightHealthBars() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Knight) {
        enemy.update(); // Aktualisiere die Position der Statusleiste des Ritters
        enemy.healthBar.setPercentage(enemy.energy);
      }
    });
  }

  checkCollisionsWithEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit(enemy);
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    this.character.checkCollisionWithPoison();
  }

  checkCollisionsWithEndboss() {
    if (this.level.endboss && this.character.isColliding(this.level.endboss)) {
      this.character.attackEndboss(this.level.endboss);
    }
  }

  updateCoins() {
    this.coinsArray.forEach((coin, index) => {
      if (coin.isActive && this.character.checkCollision(coin)) {
        coin.deactivate(); // Münze inaktiv setzen
        this.coinsArray.splice(index, 1); // Münze aus dem Array entfernen
        this.character.coinsCollected++; // Münzenzähler erhöhen
        this.coinStatusBar.setPercentage(this.character.coinsCollected); // Statusleiste aktualisieren
      }
    });
  }

  updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (poison.isActive && this.character.checkCollision(poison)) {
        poison.deactivate(); // Gift inaktiv setzen
        this.poisonsArray.splice(index, 1); // Gift aus dem Array entfernen
        this.character.poisonCollected++; // Giftzähler erhöhen
        this.poisonStatusBar.setPercentage(this.character.poisonCollected * 20); // Statusbar aktualisieren
      }
    });
  }

  updateEndbossHealth() {
    if (this.level.endboss) {
      this.endbossHealthBar.setPercentage(this.level.endboss.energy);
    }
  }

  killSnakes() {
    this.level.enemies = this.level.enemies.filter(enemy => !(enemy instanceof Snake));
  }

  checkCollision(object1, object2) {
    return object1.checkCollision(object2);
  }

  addCloudsWhenCharacterMoves() {
    const now = new Date().getTime();
    // Prüfen, ob der Charakter sich bewegt und nicht verletzt oder tot ist
    if (
      this.character.isMoving() &&
      !this.character.isHurt() &&
      !this.character.isDead() &&
      now - this.lastCloudSpawn > this.cloudSpawnInterval
    ) {
      this.level.clouds.push(new Cloud()); // Neue Wolke hinzufügen
      this.lastCloudSpawn = now; // Zeit aktualisieren
    }
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Verschiebe die Kamera, um den Hintergrund anzupassen
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects); // Hintergrund zeichnen
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
    this.addToMap(this.coinStatusBar);// Zeichne fixierte Objekte (Statusleisten)
    if (this.currentLevelIndex === 1) {
      this.addToMap(this.poisonStatusBar); // Nur in Level 2 zeichnen
    }
    this.addToMap(this.statusBar);
    this.statusBar.draw(this.ctx); // Statusleisten separat zeichnen (falls erforderlich)
    this.coinStatusBar.draw(this.ctx);
    this.addToMap(this.endbossHealthBar); // Zeichne die Statusleiste des Endbosses
    this.endbossHealthBar.draw(this.ctx);
    this.addToMap(this.character.healthBar); // Zedichne die Statusleiste des Charakters
    this.ctx.translate(this.camera_x, 0);  // Zeichne Kamera-gebundene Objekte (Charakter, Gegner, Münzen)
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.character);
  
    this.coinsArray.forEach((coin) => { // Münzen zeichnen und Kollisionsbox anzeigen
        if (coin.isActive) {
          coin.draw(this.ctx, this.camera_x); // Münze zeichnen
        }
    });
    this.poisonsArray.forEach((poison) => { // Giftobjekte zeichnen
      poison.draw(this.ctx, this.camera_x); // Giftobjekt zeichnen
    });
    this.throwableObjects.forEach((bottle) => { // Throwable objects zeichnen
      bottle.draw(this.ctx, this.camera_x); // Throwable object zeichnen
    });
    this.ctx.translate(-this.camera_x, 0);// Kamera zurücksetzen
    this.enemies.forEach(enemy => {
      enemy.draw(this.ctx);
      if (enemy instanceof Knight) {
        enemy.healthBar.draw(this.ctx); // Zeichne die Statusleiste des Ritters
      }
    });
    this.characters.forEach(character => character.draw(this.ctx));
  }
  
  addObjectsToMap(objects) {
    if (objects && Array.isArray(objects)) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    } else {
        console.error('Objects is not an array or is undefined');
    }

    // Wenn der Hintergrund links aus dem Sichtfeld verschwindet, wiederhole ihn
    if (this.backgroundObjects.length > 0 && this.camera_x >= this.backgroundObjects[0].width) {
        this.camera_x = 0; // Setze die Kamera zurück, wenn der Hintergrund den Bildschirm verlassen hat
    }
  }

  addToMap(mo) {
    if (mo && mo.otherDirection) {
      this.flipImage(mo); // Bild spiegeln, falls nötig
    }
    if (mo) {
      mo.draw(this.ctx); // Bild zeichnen
      mo.drawFrame(this.ctx); // Bild aktualisieren
    }
    if (mo && mo.otherDirection) {
      this.flipImageBack(mo); // Bild zurückdrehen
    }
  }

  flipImage(mo) {
    this.ctx.save(); // speichert den aktuellen Zustand des Canvas
    this.ctx.translate(mo.width, 0); // verschiebt das Bild um die Breite des Bildes
    this.ctx.scale(-1, 1); // spiegelt das Bild
    mo.x = mo.x * -1; // dreht das Bild um 180 Grad
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1; // dreht das Bild um 180 Grad zurück
    this.ctx.restore(); // stellt den gespeicherten Zustand wieder her
  }

  checkLevelCompletion() {
    if (this.level.enemies.length === 0 && this.character.poisonCollected >= 4) {
      this.advanceToNextLevel();
    }
  }

  advanceToNextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      this.level = this.levels[this.currentLevelIndex];
      this.enemies = this.level.enemies || []; // Sicherstellen, dass es ein Array ist
      this.character.resetForNewLevel(); // Setze den Charakter für das neue Level zurück
      this.setWorld();
    }
  }

  checkThrowableObject() {
    if (this.keyboard.D && this.character.poisonCollected > 0) {
      this.character.throwObject();
    }
  }
}