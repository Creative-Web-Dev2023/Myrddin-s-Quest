class KnightStatusbar extends DrawableObject {
  IMAGES = [
    'img/game_ui/statusbars/statusbar-health/0.png',
    'img/game_ui/statusbars/statusbar-health/20.png',
    'img/game_ui/statusbars/statusbar-health/40.png',
    'img/game_ui/statusbars/statusbar-health/60.png',
    'img/game_ui/statusbars/statusbar-health/80.png',
    'img/game_ui/statusbars/statusbar-health/100.png',
  ];
  
  percentage = 100; // Start with a full status bar
  
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x =2; 
    this.y =10; // Position der Statusbar
    this.width = 190;  // Passe die Breite an
    this.height = 50;  // Passe die Höhe an
  }
  
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.calculateImageIndex()];
    this.img = this.imageCache[path];
  }
  
  calculateImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    }
    if (this.percentage >= 80) {
      return 4;
    }
    if (this.percentage >= 60) {
      return 3;
    }
    if (this.percentage >= 40) {
      return 2;
    }
    if (this.percentage >= 20) {
      return 1;
    }
    return 0;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}