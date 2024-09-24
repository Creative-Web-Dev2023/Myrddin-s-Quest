class World {
  character = new Character();
  enemies = [new Knight(),
             new Knight(), 
             new Knight()];
  clouds = [];      
  backgroundObjects =[
    new BackgroundObject('img/game_backgrounds/4/7.png',-719), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png',-719), // 0 = x, 0 = ynew BackgroundObject('img/game_backgrounds/3/3.png',20,100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/4.png',-719, 0), // 719 = x, 80 = y 
    new BackgroundObject('img/game_backgrounds/3/3.png',  -719, 100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/3/2.png',-719), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/1.png',-719), // 719 = x, 80 = y

    new BackgroundObject('img/game_backgrounds/4/7.png',0), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png', 0), // 0 = x, 0 = ynew BackgroundObject('img/game_backgrounds/3/3.png',20,100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/4.png',0, 0), // 719 = x, 80 = y 
    new BackgroundObject('img/game_backgrounds/3/3.png',  98, 100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/3/2.png',0), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/1.png',0), // 719 = x, 80 = y

    new BackgroundObject('img/game_backgrounds/4/7.png',719), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png',719), // 0 = x, 0 = ynew BackgroundObject('img/game_backgrounds/3/3.png',20,100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/4.png',719, 0), // 719 = x, 80 = y 
    new BackgroundObject('img/game_backgrounds/3/3.png',719, 100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/3/2.png',719), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/1.png',719), // 719 = x, 80 = y

    new BackgroundObject('img/game_backgrounds/4/7.png',719*2), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png',719*2), // 0 = x, 0 = ynew BackgroundObject('img/game_backgrounds/3/3.png',20,100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/4.png',719*2, 0), // 719 = x, 80 = y 
    new BackgroundObject('img/game_backgrounds/3/3.png',719*2, 100), 
    new BackgroundObject('img/game_backgrounds/3/2.png',719*2), // 
    new BackgroundObject('img/game_backgrounds/4/1.png',719*2), // 

    new BackgroundObject('img/game_backgrounds/4/7.png',719*3), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png',719* 3),
    new BackgroundObject('img/game_backgrounds/4/4.png',719*3, 0), //
    new BackgroundObject('img/game_backgrounds/3/3.png',719*3, 100), //
    new BackgroundObject('img/game_backgrounds/3/2.png',719*3), // 
    new BackgroundObject('img/game_backgrounds/4/1.png',719*3), // 
  ];    
  canvas;
  ctx;
  keyboard;
  camera_x= 0; // die Kamera wird um 100 nach links verschoben

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    for (let i = 0; i < 2; i++) {
      this.clouds.push(new Cloud()); //erstellt 2 Wolken
    }
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }
  setWorld(){
    this.character.world = this;
  }
  draw() { // die function wird 60x/pro Sekunde aufgerufen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Welt wird geleert
    this.ctx.translate(this.camera_x, 0); // die Welt wird um 100 nach links verschoben
    this.addObjectsToMap (this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap (this.enemies);
    this.addObjectsToMap (this.clouds);
    this.ctx.translate(-this.camera_x,0);// die Welt wird wieder zurückgeschoben

    let self = this; // self ist das World Objekt
    requestAnimationFrame(function () {
      self.draw();
    });
  }
  addObjectsToMap(objects){
   objects.forEach (o => {
      this.addToMap(o);
    });
  }
  addToMap(mo){
    if(mo.otherDirection){ //wir schauen ob das Objekt in die andere Richtung schaut
      this.ctx.save(); //speichert den aktuellen Zustand des Canvas
      this.ctx.translate( mo.width, 0); // verschiebt das Bild um die Breite des Bildes
      this.ctx.scale(-1, 1); // spiegelt das Bild
      mo.x = mo.x * -1; // dreht das Bild um 180 Grad
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height); 
    
    if(mo.otherDirection){
      mo.x = mo.x * -1; // dreht das Bild um 180 Grad
      this.ctx.restore(); // stellt den gespeicherten Zustand wieder her
    }
  }
}
