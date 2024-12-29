class Key extends DrawableObject {
  IMAGES_KEY = [
    "img/game_items/key.png"
  ];

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.isActive = true; // Ensure the key is active
    this.loadImages(this.IMAGES_KEY);
  }

  deactivate() {
    this.isActive = false;
  }

  draw(ctx) {
    if (this.isActive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  static initializeKeys() {
    return [
      new Key(300, 400), // x: 300, y: 400
    ];
  }
}

