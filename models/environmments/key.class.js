class Key extends DrawableObject {
  constructor(x, y, id) {
    super().loadImage('img/game_items/key.png'); 
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.id = id;
    this.isActive = true;
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  deactivate() {
    this.isActive = false;
  }
}
