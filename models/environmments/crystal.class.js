class Crystal extends DrawableObject {
  constructor(x, y) {
    super();
    this.loadImage("img/game_items/diamond.png");
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.isActive = true;
    this.glowIntensity = 0;
    this.glowDirection = 1;
    this.animateGlow();
  }

  animateGlow() {
    setInterval(() => {
      if (this.isActive) {
        this.glowIntensity += this.glowDirection * 0.05;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
          this.glowDirection *= -1;
        }
      }
    }, 50);
  }

  draw(ctx) {
    super.draw(ctx);

    if (this.isActive) {
      ctx.save();
      ctx.globalAlpha = this.glowIntensity * 0.3;
      ctx.filter = `blur(${this.glowIntensity * 5}px) brightness(${
        1 + this.glowIntensity
      })`;
      ctx.drawImage(
        this.img,
        this.x - this.glowIntensity * 10,
        this.y - this.glowIntensity * 10,
        this.width + this.glowIntensity * 20,
        this.height + this.glowIntensity * 20
      );
      ctx.restore();
    }
  }
}
