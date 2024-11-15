class World {
    character;
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0; // die Kamera wird um 100 nach links verschoben
    lastCloudSpawn = 0; // Zeitpunkt, an dem die letzte Wolke erzeugt wurde
    cloudSpawnInterval = 3000; // Intervall (3 Sekunden)
    coinStatusBar; // Hier als Klassenattribut definiert
    poisonStatusBar = new PoisonStatusbar();
    statusBar; // Add statusBar as a class attribute
    characters = [];
    enemies = [];
  
    constructor(canvas, keyboard) {
      this.ctx = canvas.getContext("2d");
      this.canvas = canvas;
      this.keyboard = keyboard;
      this.level = level1; // Stellen Sie sicher, dass level1 hier verfügbar ist
      this.character = new Character(); // Initialize character
      this.coinsArray = this.initializeCoins();
      this.coinStatusBar = new CoinStatusBar(); // Instanz hier erstellen
      this.poisonStatusBar = new PoisonStatusbar();
      this.statusBar = new Statusbar(); // Instanz hier erstellen
      this.backgroundObjects = this.level.backgroundObjects || []; // Sicherstellen, dass es ein Array ist
      this.enemies = this.level.enemies || []; // Sicherstellen, dass es ein Array ist
      this.setWorld();
      this.checkCollisionsWithEnemy();
    }
  
    setWorld() {
      this.character.world = this;
    }
    initializeCoins() {
      return [
        new Coin(350, 230, 20, 40),
        new Coin(950, 250, 20, 20),
        new Coin(1350, 230, 20, 40),
        new Coin(1600, 250, 20, 20),
        new Coin(1900, 230, 20, 40),
        new Coin(2150, 250, 20, 20),
        new Coin(2500, 230, 20, 40),
      ];
    }
  
    checkCollisionsWithEnemy() {
      setInterval(() => {
        this.level.enemies.forEach((enemy) => {
          if (this.character.isColliding(enemy)) {
            this.character.hit(enemy);
            this.statusBar.setPercentage(this.character.energy);
          }
        });
      }, 100);
    }
    checkCollision(object1, object2) {
      return (
        object1.x < object2.x + object2.width &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height &&
        object1.y + object1.height > object2.y
      );
    }
  
    update() {
      this.coinsArray.forEach((coin, index) => {
        if (coin.isActive && this.checkCollision(this.character, coin)) {
          coin.deactivate(); // Münze inaktiv setzen
          this.coinsArray.splice(index, 1); // Münze aus dem Array entfernen
          this.character.coinsCollected++; // Münzenzähler erhöhen
        }
      });
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
  
    draw(ctx) {
      if (!ctx) {
        console.error('Context is not defined');
        return;
      }
      // Zeichne das Bild nur, wenn ctx definiert ist
      if (this.img && this.img.complete) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.translate(this.camera_x, 0); // Verschiebe die Kamera nach links
      this.addObjectsToMap(this.backgroundObjects); // Zeichne den Hintergrund
      this.addObjectsToMap(this.level.clouds);
      this.ctx.translate(-this.camera_x, 0); // Setze die Kamera zurück
  
      // Zeichne fixierte Objekte (Statusleisten, Charaktere, Münzen, Gegner)
      this.addToMap(this.coinStatusBar);
      this.addToMap(this.poisonStatusBar);
      this.addToMap(this.statusBar);
      this.statusBar.draw(this.ctx);
      this.coinStatusBar.draw(this.ctx);
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.enemies);
      this.addToMap(this.character);
      this.coinsArray.forEach((coin) => coin.draw(this.ctx));
      this.ctx.translate(-this.camera_x, 0);
  
      this.characters.forEach(character => character.draw(this.ctx));
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
  
      let self = this;
      requestAnimationFrame(function () {
          self.draw(); // Zeichne das nächste Frame
      });
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
  }

class Game {
  // ...existing code...
  init() {
    this.world = new World(this.canvas, this.keyboard);
    this.startGameLoop();
  }

  startGameLoop() {
    const gameLoop = () => {
      this.world.update();
      this.world.draw();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }
  // ...existing code...
}