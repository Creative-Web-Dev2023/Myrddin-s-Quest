class BackgroundObject extends MovableObject {
  constructor(imagePath, x, y = -20, width = 720, height = 500) { 
    super();  
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImage(imagePath);
  }

  move(speed) {
    this.x -= speed;
    if (this.x <= -this.width) {
      this.x += this.width;
    }
  }
  
  draw(ctx) {
    const imageProps = {
      'candle': { width: 200, height: 320, yOffset: 115 },
      'skull': { width: 180, height: 160, yOffset: 273 }
    };

    const imgType = Object.keys(imageProps).find(type => this.img.src.includes(type));
    
    if (imgType) {
      const props = imageProps[imgType];
      ctx.drawImage(this.img, this.x, this.y + props.yOffset, props.width, props.height);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}