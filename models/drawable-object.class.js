class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    if (arr && Array.isArray(arr)) {
      arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
    } 
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this.drawRectangle) {
      ctx.beginPath();
      ctx.lineWidth = '5';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}

class CollectableObject extends DrawableObject {
  constructor(x, y, width, height, imagePath) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImage(imagePath);
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// Entfernen Sie die doppelten Klassendeklarationen
// class Coin extends CollectableObject {
//   static coinImage = "img/game_items/coin.png";

//   constructor(x, y) {
//     super(x, y, 50, 50, Coin.coinImage);
//   }
// }

// class Key extends CollectableObject {
//   static keyImage = "img/game_items/key.png";

//   constructor(x, y) {
//     super(x, y, 50, 50, Key.keyImage);
//   }
// }

// class Poison extends CollectableObject {
//   static poisonImage = "img/game_items/poison.png";

//   constructor(x, y) {
//     super(x, y, 50, 50, Poison.poisonImage);
//   }
// }