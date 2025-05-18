class Candle extends DrawableObject {
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.candle;
    this.x = x;
    this.y = 200;
    this.width = 300;
    this.height = 300;
  }
}