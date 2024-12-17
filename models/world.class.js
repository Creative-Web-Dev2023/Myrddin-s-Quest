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
  statusBar; // Add statusBar as a class attribute
  characters = [];
  enemies = [];
  throwableObjects = []; // Füge ein werfbares Objekt hinzu
  currentLevelIndex = 0; // Aktuelles Level
  // Stelle sicher, dass level1 definiert ist
  levels = [level1]; // Liste der Levels
  imageCache = {}; // Initialisiere den imageCache
  IMAGES_YOU_LOST = [
    "img/game_ui/game_over.png",
  ];
  quitButton;
  quitButtonImage = "img/game_ui/quit.png"; // Pfad zum Quit-Button-Bild
  tryAgainButton;
  tryAgainButtonImage = "img/game_ui/try_again.png"; // Pfad zum Try Again-Button-Bild
  levelCompleted = false; // Füge eine Variable hinzu, um den Abschluss des Levels zu verfolgen
  collectables = []; // Füge ein Array für Sammelobjekte hinzu
  keys = []; // Füge ein Array für Schlüssel hinzu
  coinCollectSound = new Audio('audio/collect_coins.mp3'); // Initialisieren Sie den Audio-Player nur einmal
  endGame; // Add endGame as a class attribute
  door; // Füge die Tür als Attribut hinzu


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
      height: buttonHeight
    };
    this.tryAgainButton = {
      x: canvasCenterX + buttonSpacing / 2,
      y: this.quitButton.y,
      width: buttonWidth,
      height: buttonHeight
    };
    this.keyboard.T = false; // Initialisiere die T-Taste
    this.keyboard.D = false; // Initialisiere die D-Taste
    this.level = this.levels[this.currentLevelIndex]; // Initialisiere das erste Level
    this.randomizeCloudPositions(); // Zufällige Positionen für Wolken setzen
    this.coinStatusBar = new CoinStatusBar(); // Instanz hier erstellen
    this.poisonStatusBar = new PoisonStatusBar(); // Stelle sicher, dass die Statusleiste für Gift initialisiert wird
    this.statusBar = new StatusBar(this.character); // Instanz hier erstellen
    if (this.level.endboss) {
      this.endbossHealthBar = new EndbossStatusBar(this.level.endboss.x, this.level.endboss.y - 50); // Stelle sicher, dass der Name korrekt ist
    }
    this.character = new Character(this, this.coinStatusBar, this.poisonStatusBar); // Initialize character with parameters
    this.character.world.keyboard = this.keyboard; // Keyboard an den Character weiterleiten
    this.coinsArray = CollectableObjects.initializeCoins(); // Verwenden Sie die neue Methode aus collectable-objects.js
    this.poisonsArray = CollectableObjects.initializePoisons(); // Initialisiere Giftobjekte
    this.keysArray = CollectableObjects.initializeKeys(); // Initialisiere Schlüssel
    this.backgroundObjects = this.level.backgroundObjects || []; // Sicherstellen, dass es ein Array ist
    this.enemies = this.level.enemies || []; // Initialisiere die Feinde aus dem Level
    this.loadImages(this.IMAGES_YOU_LOST); // Lade das "You Lost" Bild
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]); // Lade die Button-Bilder
    this.door = new Door(1000, 200); // Initialisiere die Tür mit einer Position
    this.setWorld();
    this.startGameLoop();
    this.camera_x = -this.character.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
    this.endGame = new EndGame(this); // Initialisieren Sie die EndGame-Klasse
  }

  setWorld() {
    this.character.world = this;                                                                                                                                                                                                                                                                      
    this.enemies.forEach(enemy => {
      if (enemy instanceof Knight) {
        enemy.world = this; // Setze die world-Eigenschaft für den Ritter
      }
    });
    if (this.door) {
      this.door.world = this; // Setze die world-Eigenschaft für die Tür
    }
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  startGameLoop() {
    this.canvas.addEventListener("click", this.handleMouseClick.bind(this)); // Event-Listener hinzufügen
    const gameLoop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  update() {
    if (this.levelCompleted) return; // Stoppe das Update, wenn das Level abgeschlossen ist

    this.checkCollisionsWithEnemy();
    this.character.update();
    this.updateCoins();
    this.updatePoison();
    this.checkCollisionsWithEndboss();
    this.updateEndbossHealth();
    this.checkThrowableObject(); // Überprüfen, ob eine Flasche geworfen werden soll // Überprüfe, ob alle Ritter besiegt sind
    this.checkCollisionsWithCollectables(); // Überprüfe Kollisionen mit Sammelobjekten
    this.character.checkKnightAttack(); // Überprüfe, ob der Ritter den Charakter angreift
    Door.checkCharacterNearDoor(this); // Überprüfe, ob der Charakter die Tür betritt
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound(); // Spielt das Laufgeräusch nur ab, wenn die Musik eingeschaltet ist
    }
    if (this.character.isDead()) {
      setTimeout(() => {
        this.endGame.showYouLostScreen(); // Zeige den "You Lost" Bildschirm
      }, 200); // Verkürze die Zeit auf 500ms
    }

    // Überprüfe dann die Kollision mit der Tür
    if (this.character.checkCollisionWithDoor(this.door)) {
      this.character.enterDoor(); // Charakter für kurze Zeit unsichtbar machen
      this.door.enterDoor(this.character); // Beispiel: Tür öffnen
     
    }
  }

  randomizeCloudPositions() {
    const totalLength = 2600; // Gesamtlänge des Levels
    const cloudCount = this.level.clouds.length;
    const spacing = totalLength / cloudCount; // Abstand zwischen den Wolken

    this.level.clouds.forEach((cloud, index) => {
      cloud.x = index * spacing + Math.random() * spacing; // Gleichmäßig verteilen und zufällig innerhalb des Abstands
      cloud.y = Math.random() * 50; // Zufällige y-Position, nicht zu weit unten
    });
  }

  checkCollisionsWithEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit(enemy);
        this.statusBar.setPercentage(this.character.energy);
        if (enemy instanceof Knight) {
          enemy.energy -= 20; // Reduziere die Energie des Ritters
          if (enemy.isDead()) {
            enemy.playAnimation(enemy.IMAGES_DEAD);
          } else if (enemy.isHurt()) {
            enemy.playAnimation(enemy.IMAGES_HURT);
          }
        }
      }
    });
    // this.character.checkCollisionWithPoison();
  }

  checkCollisionsWithEndboss() {
    if (this.level.endboss && this.character.isColliding(this.level.endboss)) {
      this.character.attackEndboss(this.level.endboss);
    }
  }

  updateCoins() {
    this.coinsArray.forEach((coin, index) => {
        if (coin.isActive && this.checkCollision(this.character, coin)) {
            coin.deactivate(); // Deaktiviert die Münze (macht sie unsichtbar)
            this.character.collectCoins(); // Fügt dem Charakter eine Methode hinzu, um Münzen zu zählen
            this.coinsArray.splice(index, 1); // Entferne die Münze aus dem Array
        }
    });

    this.keys.forEach((key) => {
        if (key.isActive) {
            // Logik für den Schlüssel
        }
    });
}

  updatePoison() {
    this.poisonsArray.forEach((poison, index) => {
      if (poison.isActive && this.character.checkCollision(poison)) {
        poison.deactivate(); // Gift inaktiv setzen
        this.poisonsArray.splice(index, 1); // Gift aus dem Array entfernen
        this.character.poisonCollected++; // Giftzähler erhöhen
        if (this.poisonStatusBar) {
          this.poisonStatusBar.setPercentage(this.character.poisonCollected * 20); // Statusbar aktualisieren
        }
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
    this.drawCoins(); // Zeichne die Münzen
    this.drawPoisons(); // Zeichne die Giftflaschen
    this.drawKeys(); // Zeichne die Schlüssel
    if (this.door) {
      this.door.draw(this.ctx); // Zeichne die Tür
    }
    if (this.character.isDead()) {
      this.endGame.showYouLostScreen(); // Verwenden Sie die Methode aus der EndGame-Klasse
    }
    this.drawCollectables(); // Zeichne die Sammelobjekte
  }

  drawCoins() {
    this.coinsArray.forEach((coin) => {
      if (coin.isActive) {
        coin.draw(this.ctx);
      }
    });
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.backgroundObjects.forEach((obj) => {
      this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
    });
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawStatusBars() {
    this.addToMap(this.coinStatusBar);
    if (this.currentLevelIndex === 1) {
      this.addToMap(this.poisonStatusBar);
    }
    this.addToMap(this.statusBar);
    this.statusBar.draw(this.ctx);
    this.coinStatusBar.draw(this.ctx);
    if (this.currentLevelIndex === 1 && this.level.endboss) {
      this.endbossHealthBar.x = this.level.endboss.x;
      this.endbossHealthBar.y = this.level.endboss.y - 50;
      this.addToMap(this.endbossHealthBar);
      this.endbossHealthBar.draw(this.ctx);
    }
    this.addToMap(this.character.healthBar);
    if (this.poisonStatusBar) {
      this.addToMap(this.poisonStatusBar);
      this.poisonStatusBar.draw(this.ctx);
    }
  }

  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.enemies);
    this.coinsArray.forEach((coin) => {
      if (coin.isActive) {
        coin.draw(this.ctx, this.camera_x);
      }
    });
    this.poisonsArray.forEach((poison) => {
      poison.draw(this.ctx, this.camera_x);
    });
    this.throwableObjects.forEach((bottle) => {
      bottle.draw(this.ctx, this.camera_x);
    });
    this.ctx.translate(-this.camera_x, 0);
  }

  drawEnemies() {
    this.enemies.forEach(enemy => {
      enemy.draw(this.ctx);
      if (enemy instanceof Knight && enemy.comets) { // Überprüfe, ob enemy.comets existiert
        enemy.comets.forEach(comet => {
          comet.draw(this.ctx);
        });
      }
    });
    if (this.level.endboss) {
      this.level.endboss.draw(this.ctx);
    }
  }

  drawCharacter() {
    this.ctx.translate(this.camera_x, 0); // Kamera-gebundene Objekte zeichnen
    this.addToMap(this.character);
    this.characters.forEach(character => character.draw(this.ctx));
    this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
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

  checkThrowableObject() {
    if (this.keyboard.D && this.character.poisonCollected > 0) {
      this.character.throwObject();
      playPoisonBottleSound(); // Sound abspielen, wenn die Flasche geworfen wird
    }
  }


  drawCollectables() {
    this.ctx.translate(this.camera_x, 0); // Kamera-gebundene Objekte zeichnen
    this.collectables.forEach((collectable) => collectable.draw(this.ctx));
    this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
  }

  checkCollisionsWithCollectables() {
    this.collectables.forEach((collectable) => {
      if (this.character.isColliding(collectable) && collectable.isActive) {
        collectable.deactivate(); // Deaktiviere das Sammelobjekt
        this.handleCollectable(collectable); // Reagiere basierend auf dem Typ
      }
    });
  }

  handleCollectable(collectable) {
    switch (collectable.type) {
      case "COIN":
        this.character.coinsCollected++;
        this.coinStatusBar.setPercentage(this.character.coinsCollected);
        break;
      case "KEY":
        this.character.keysCollected++;
        break;
      case "POISON":
        this.character.energy -= 10; // Gift reduziert Energie
        this.statusBar.setPercentage(this.character.energy);
        break;
      default:
        console.warn("Unbekannter Collectable-Typ:", collectable.type);
    }
  }
}


  