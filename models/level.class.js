class Level {
  enemies;
  clouds;
  backgroundObjects;

  poisonObjects;
  level_end_x = 5000; // Level endet bei x = 5000;
  
  constructor(enemies, clouds, backgroundObjects, poisonObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.poisonObjects = poisonObjects || [];  // Poison-Objekte initialisieren
  }

  draw(ctx) {
    this.backgroundObjects.forEach((bg) => bg.draw(ctx)); // Zeichne die Hintergrundobjekte
    this.clouds.forEach((cloud) => cloud.draw(ctx)); // Zeichne die Wolken
    this.enemies.forEach((enemy) => enemy.draw(ctx)); // Zeichne die Feinde
    this.poisonObjects.forEach((poison) => {
      poison.drawFrame(ctx, camera_x);         // Zeichne das Poison-Objekt
    });
  }


}
