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
  poisonStatusBar; // Füge die PoisonStatusBar hinzu
  imageCache = {}; // Initialisiere den imageCache
  IMAGES_YOU_LOST = [
    "img/game_ui/game_over.png",
  ];
  quitButton;
  quitButtonImage = "img/game_ui/quit.png"; // Pfad zum Quit-Button-Bild
  tryAgainButton;
  tryAgainButtonImage = "img/game_ui/try_again.png"; // Pfad zum Try Again-Button-Bild
  door; // Füge eine Tür als Klassenattribut hinzu
  levelCompleted = false; // Füge eine Variable hinzu, um den Abschluss des Levels zu verfolgen

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
    this.coinStatusBar = new CoinStatusBar(); // Instanz hier erstellen
    if (this.currentLevelIndex === 1) {
      this.poisonStatusBar = new PoisonStatusbar(); // Nur in Level 2 erstellen
    }
    this.statusBar = new Statusbar(); // Instanz hier erstellen
    this.poisonStatusBar = new PoisonStatusbar(); // Instanz hier erstellen
    this.character = new Character(this, this.coinStatusBar, this.poisonStatusBar); // Initialize character with parameters
    this.character.world.keyboard = this.keyboard; // Keyboard an den Character weiterleiten
    this.coinsArray = this.initializeCoins();
    this.poisonsArray = this.level.poisonObjects; // Initialisiere Giftobjekte
    this.backgroundObjects = this.level.backgroundObjects || []; // Sicherstellen, dass es ein Array ist
    this.enemies = this.level.enemies || []; // Initialisiere die Feinde aus dem Level
    this.endbossHealthBar = new Statusbar(); // Instanz hier erstellen
    this.loadImages(this.IMAGES_YOU_LOST); // Lade das "You Lost" Bild
    this.loadImages([this.quitButtonImage, this.tryAgainButtonImage]); // Lade die Button-Bilder
    this.door = new Door(4500, 70); // Initialisiere die Tür
    this.door.isOpen = false; // Tür ist zu Beginn geschlossen
    this.setWorld();
    this.startGameLoop();
    this.camera_x = -this.character.x - 190; // Setze die Kamera auf die Anfangsposition des Charakters
  }

  setWorld() {
    this.character.world = this;                                                                                                                                                                                                                                                                      
    this.enemies.forEach(enemy => {
      if (enemy instanceof Knight) {
        enemy.world = this; // Setze die world-Eigenschaft für den Ritter
      }
    });
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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
    this.addCloudsWhenCharacterMoves();
    this.checkCollisionsWithEndboss();
    this.updateEndbossHealth();
    this.checkThrowableObject(); // Überprüfen, ob eine Flasche geworfen werden soll
    this.checkKnightsDefeated(); // Überprüfe, ob alle Ritter besiegt sind
    this.checkCharacterNearDoor(); // Überprüfe, ob der Charakter sich der Tür nähert
    if (this.character.isMoving() && musicIsOn) {
      playWalkingSound(); // Spielt das Laufgeräusch nur ab, wenn die Musik eingeschaltet ist
    }
    if (this.character.isDead()) {
      setTimeout(() => {
        this.showYouLostScreen(); // Zeige den "You Lost" Bildschirm
      }, 200); // Verkürze die Zeit auf 500ms
    }
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
        playCollectCoinSound(); // Sound abspielen
        if (coin instanceof Key) {
          this.openDoor(); // Tür öffnen, wenn der Schlüssel eingesammelt wird
        }
      }
    });
  }

  playCollectCoinSound() {
    if (window.isAudioOn) {
      const audio = new Audio('audio/collect_coins.mp3'); // Aktualisieren Sie den Pfad zur Sounddatei
      audio.play();
    }
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
    const box1 = object1.getCollisionBox();
    const box2 = object2.getCollisionBox();
    return box1.x + box1.width > box2.x &&
           box1.x < box2.x + box2.width &&
           box1.y + box1.height > box2.y &&
           box1.y < box2.y + box2.height;
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
    this.clearCanvas();
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.drawEnemies();
    this.drawCharacter();
    this.drawLostScreen();
    this.drawDoor(); // Zeichne die Tür
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
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

  drawLostScreen() {
    if (this.character.isDead()) {
      this.showYouLostScreen();
    }
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

  playAnimation(images) {
    if (images && images.length > 0) { // Überprüfen, ob das Array definiert und nicht leer ist
      let i = this.currentImage % images.length; // Auf das übergebene Array zugreifen
      let path = images[i]; // Bildpfad aus dem Array
      this.img = this.imageCache[path]; // Bild aus dem Cache setzen
      this.currentImage++;
      if (this.currentImage >= images.length) { 
        this.currentImage = 0; // Setze auf den ersten Frame zurück
      }
    }
  }

  showYouLostScreen() {
    const gameOverContainer = document.getElementById('game-over-container');
    gameOverContainer.style.display = 'flex'; // Ändere auf 'flex', um den Container anzuzeigen
    document.getElementById('quitButton').style.display = 'block';
    document.getElementById('tryAgain').style.display = 'block';
  }

  tryAgain() {
    location.reload(); // Seite neu laden, um das Spiel neu zu starten
  }
 
  checkKnightsDefeated() {
    const allKnightsDefeated = this.enemies.every(enemy => 
        !(enemy instanceof Knight) || enemy.isDead
    );

    if (allKnightsDefeated && !this.door.isOpen) {
        this.openDoor(); // Tür öffnen
    }

    if (allKnightsDefeated && this.character.hasKey) {
      this.completeLevel(); // Level abschließen, wenn alle Ritter besiegt und der Schlüssel eingesammelt wurden
    }
  }

  completeLevel() {
    this.levelCompleted = true; // Setze die Variable auf true, um das Update zu stoppen
    setTimeout(() => {
      this.showLevelCompletedText(); // Zeige den Text nach einer kurzen Verzögerung
    }, 500); // Verzögerung von 500ms
  }

  showLevelCompletedText() {
    const levelCompletedContainer = document.getElementById('level-completed-container');
    levelCompletedContainer.classList.remove('hidden');
    levelCompletedContainer.classList.add('show');
    this.stopGame(); // Stoppe das Spiel
  }
  stopGame() {
    // Hier kannst du die Logik hinzufügen, um das Spiel zu stoppen
    clearInterval(this.gameLoopInterval); // Stoppe die Spielschleife
    // Weitere Logik zum Stoppen des Spiels
  }
  drawDoor() {
    if (this.door) {
      this.door.draw(this.ctx); // Zeichnet die Tür auf das Canvas
      this.door.drawCollisionBox(this.ctx); // Optional: Kollisionsbox anzeigen
    }
  }

  checkCharacterNearDoor() {
    if (this.door && !this.door.isOpen && this.character.isColliding(this.door)) {
      this.openDoor(); // Tür öffnen, wenn der Charakter sich nähert
    }
  }

  openDoor() {
    this.door.openDoor(); // Tür öffnen
  }
}