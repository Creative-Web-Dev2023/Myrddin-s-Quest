class BackgroundObject extends MovableObject {
    width = 720;
    height = 500;
  
    constructor(imagePath, x, y = 480 - 500) {
      super();
      this.x = x;
      this.y = y;
      this.loadImage(imagePath);
    }
  
    // Überschreibe die draw-Methode
    draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      // Keine Rechteckzeichnung hier
    }
  }
  