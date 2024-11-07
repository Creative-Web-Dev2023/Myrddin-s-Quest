class World {
  character;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0; // die Kamera wird um 100 nach links verschoben
  lastCloudSpawn = 0; // Zeitpunkt, an dem die letzte Wolke erzeugt wurde
  cloudSpawnInterval = 3000; // Intervall (3 Sekunden)
  statusBar = new Statusbar();
  coinStatusBar; // Hier als Klassenattribut definiert

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.coinsArray = this.initializeCoins();
    this.character = new Character(this.keyboard, this.coinStatusBar); // Pass keyboard to Character
    this.coinStatusBar = new CoinStatusBar(); // Instanz hier erstellen
    this.backgroundObjects ;
    this.draw();
    this.setWorld();
    this.checkCollisionsWithEnemy();
  }

  setWorld() {
    this.character.world = this;
  } 
  initializeCoins() {
    return [
        new Coin(500, 230),
        new Coin(800, 250),
        new Coin(1000.230),
        new Coin(1500, 250),
        new Coin(1800, 230),
        new Coin(2100, 250),
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
    if (this.character.isMoving() && !this.character.isHurt() && !this.character.isDead() && now - this.lastCloudSpawn > this.cloudSpawnInterval) {
      this.level.clouds.push(new Cloud()); // Neue Wolke hinzufügen
      this.lastCloudSpawn = now; // Zeit aktualisieren
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);// Kamera verschieben
    this.addObjectsToMap(this.level.backgroundObjects); // Hintergrundobjekte hinzufügen
    
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
    //Space for fix objects
    this.addToMap(this.statusBar); // Statusbar richtig hinzufügen
    this.addToMap(this.coinStatusBar); // Münzstatusleiste richtig hinzufügen
    this.coinStatusBar.draw(this.ctx);
    this.ctx.translate(this.camera_x, 0);// Kamera verschieben
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.coinsArray.forEach(coin => coin.draw(this.ctx));
    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) { 
      this.flipImage(mo); // Bild spiegeln, falls nötig
    }
    mo.draw(this.ctx); // Bild zeichnen
    mo.drawFrame(this.ctx); // Bild aktualisieren
    if (mo.otherDirection) {
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