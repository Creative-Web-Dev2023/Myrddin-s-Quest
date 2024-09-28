class World {
  character = new Character();
  level = level1;    
  canvas;
  ctx;
  keyboard;
  camera_x= 0; // die Kamera wird um 100 nach links verschoben

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;

    // for (let i = 0; i < 2; i++) {
    //   this.clouds.push(new Cloud()); //erstellt 2 Wolken
    // }
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
   
    this.addObjectsToMap (this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap (this.level.enemies);
    this.addObjectsToMap (this.level.clouds);

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
