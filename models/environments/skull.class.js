class Skull extends DrawableObject {
  constructor(x) {
    super();
    this.img = LOADED_IMAGES.game_items.skull;
    this.x = x;
    this.y = 280;
    this.width = 250;
    this.height = 250;
  }
}