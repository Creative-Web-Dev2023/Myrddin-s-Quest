class World {
  character = new Character();
  enemies = [new Knight(),
             new Knight(), 
             new Knight()];
  clouds = [];           
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
     // Erzeuge 5 Wolken (oder eine andere Anzahl)
     for (let i = 0; i < 5; i++) {
      this.clouds.push(new Cloud());
    }
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.character.img,this.character.x,this.character.y,this.character.width,this.character.height);
    this.enemies.forEach (enemy => {
      this.ctx.drawImage( enemy.img, enemy.x, enemy.y,enemy.width,enemy.height);
    });  
    
    this.clouds.forEach (cloud => {
      this.ctx.drawImage( cloud.img, cloud.x, cloud.y,cloud.width,cloud.height);
    });  

    //Draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
}
