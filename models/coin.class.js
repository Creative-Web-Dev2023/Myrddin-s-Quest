class Coin extends DrawableObject {
    IMAGES_COIN = [
      'img/game_items/coin1.png',
      'img/game_items/coin2.png',
      'img/game_items/coin3.png',
      'img/game_items/coin4.png',
      'img/game_items/coin5.png',
      'img/game_items/coin6.png',
      'img/game_items/coin7.png',
      'img/game_items/coin8.png',
      'img/game_items/coin9.png',
      'img/game_items/coin10.png',
    ];
  
    constructor(x, y) {
      super();
      this.imageCache = {};
      this.loadImages(this.IMAGES_COIN); // Bilder laden
      this.x = x;
      this.y = y;
      this.width = 60; // Breite des Münzbilder
      this.height = 60; // Höhe des Münzbilder
      this.currentImageIndex = 0;
      this.img = new Image();
      this.img.src = this.IMAGES_COIN[this.currentImageIndex];
      this.isActive = true; // Münze ist aktiv, bis sie gesammelt wird
      this.animate();
    }
  
    animate() {
      this.animationInterval = setInterval(() => {
        if (!this.isActive) {
          clearInterval(this.animationInterval); // Stoppe die Animation, wenn die Münze inaktiv wird
          return;
        }
        this.currentImageIndex = (this.currentImageIndex + 1) % this.IMAGES_COIN.length;
        this.img = this.imageCache[this.IMAGES_COIN[this.currentImageIndex]];
      }, 100);
    }
    draw(ctx) {
      if (this.isActive) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
  }
    
    deactivate() {
      this.isActive = false; // Mache die Münze inaktiv, nachdem sie gesammelt wurde
    }
  }
  