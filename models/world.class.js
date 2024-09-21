class World {
  character = new Character();
  enemies = [new Knight(),
             new Knight(), 
             new Knight()];
  clouds = [];      
  backgroundObjects =[
    new BackgroundObject('img/game_backgrounds/4/7.png',0), //0 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/6.png', 0), // 0 = x, 0 = ynew BackgroundObject('img/game_backgrounds/3/3.png',20,100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/4.png',0, 0), // 719 = x, 80 = y 
    new BackgroundObject('img/game_backgrounds/3/3.png',  98, 100), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/3/2.png',0), // 719 = x, 80 = y
    new BackgroundObject('img/game_backgrounds/4/1.png',0), // 719 = x, 80 = y
  ];    
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    for (let i = 0; i < 2; i++) {
      this.clouds.push(new Cloud()); //erstellt 2 Wolken
    }
    this.draw();
  }

  draw() { // die function wird 60x/pro Sekunde aufgerufen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Welt wird geleert
    this.addObjectsToMap (this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap (this.enemies);
    this.addObjectsToMap (this.clouds);

    //Draw wird immer wieder aufgerufen
    let self = this;
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
    this.ctx.drawImage( mo.img, mo.x, mo.y,mo.width,mo.height);
  }
}
