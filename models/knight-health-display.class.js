class KnightHealthDisplay extends DrawableObject {
  IMAGES_HEARTS = ["img/game_ui/heart_empty.png", "img/game_ui/heart_full.png"];

  constructor(knight) {
    super();
    this.knight = knight;
    this.loadImages(this.IMAGES_HEARTS);
    this.x = 0;
    this.y = 0;
    this.width = 120;
    this.height = 30;
    this.energy = knight.energy;
  }

  update() {
    if (this.knight) {
      this.energy = this.knight.energy;
    }
  }

  draw(ctx) {
    this.update();
    let heartDistance = 40;
    for (let i = 0; i < 3; i++) {
      let img =
        this.energy > i * 10
          ? this.imageCache[this.IMAGES_HEARTS[1]]
          : this.imageCache[this.IMAGES_HEARTS[0]];
      ctx.drawImage(img, this.x + i * heartDistance, this.y, 30, 30);
    }
  }

  updatePosition(knightX, knightY) {
    this.x = knightX + 195;
    this.y = knightY + 30;
  }
}
