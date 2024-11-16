class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    poisonObjects;
    level_end_x = 5000; // Level endet bei x = 5000;
    
    constructor(enemies, clouds, backgroundObjects, poisonObjects) {
      this.enemies = enemies;
      this.clouds = clouds;
      this.backgroundObjects = backgroundObjects;
      this.poisonObjects = poisonObjects || [];  // Poison-Objekte initialisieren
      this.coins = [];
      this.createCoins();
    }
  
    createCoins() {
      for (let i = 0; i < 5; i++) {
        let coin = new Coin(810 + i * 150, 300); // Erstelle 5 Münzen im Abstand von 150px
        this.coins.push(coin);
      }
    }
  
    draw(ctx) {
      this.backgroundObjects.forEach((bg) => bg.draw(ctx)); // Zeichne die Hintergrundobjekte
      this.clouds.forEach((cloud) => cloud.draw(ctx)); // Zeichne die Wolken
      this.enemies.forEach((enemy) => enemy.draw(ctx)); // Zeichne die Feinde
      this.poisonObjects.forEach((poison) => poison.draw(ctx)); // Zeichne die Poison-Objekte
      this.coins.forEach((coin) => coin.draw(ctx)); // Zeichne die Münzen
    }
  
    // Beispiel für eine Kollisionserkennung zwischen dem Charakter und den Münzen
    checkCollisions(character) {
      this.coins.forEach((coin) => {
        if (coin.isActive) {
          // Überprüfe die Kollision zwischen dem Charakter und der Münze
          if (
            character.x < coin.x + coin.width &&
            character.x + character.width > coin.x &&
            character.y < coin.y + coin.height &&
            character.y + character.height > coin.y
          ) {
            coin.deactivate(); // Mache die Münze inaktiv
            character.coins++; // Erhöhe die Anzahl der gesammelten Münzen
          }
        }
      });
    }
}
