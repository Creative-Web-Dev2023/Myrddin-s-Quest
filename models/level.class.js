class Level {
  enemies;
  clouds;
  backgroundObjects;
  poisonObjects;
 
  level_end_x = 5000; // Level endet bei x = 5000;
  
  constructor(enemies, clouds, backgroundObjects, poisonObjects, key, door) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.poisonObjects = poisonObjects || [];
   
  }

  draw(ctx) {
    this.backgroundObjects.forEach((bg) => bg.draw(ctx)); 
    this.clouds.forEach((cloud) => cloud.draw(ctx)); 
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.poisonObjects.forEach((poison) => {
      poison.drawFrame(ctx, camera_x);     
    });
    
  }
}
