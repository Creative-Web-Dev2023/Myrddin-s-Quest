class PoisonStatusbar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-poison/0.png", // 0 Bild
    "img/game_ui/statusbars/statusbar-poison/20.png", // 20 Bild
    "img/game_ui/statusbars/statusbar-poison/40.png", // 40 Bild
    "img/game_ui/statusbars/statusbar-poison/60.png", // 60 Bild
    "img/game_ui/statusbars/statusbar-poison/80.png", // 80 Bild
    "img/game_ui/statusbars/statusbar-poison/100.png", // 100 Bild
  ];
  
  percentage = 0; // Start with an empty status bar
  
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 2; 
    this.y = 75; // Position der Statusbar
    this.width = 190;  // Passe die Breite an
    this.height = 50;  // Passe die Höhe an
    this.setPercentage(0); // Initialize with 0%
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

  increasePercentage(amount) {
    this.percentage = Math.min(100, this.percentage + amount);
    this.setPercentage(this.percentage);
  }
}