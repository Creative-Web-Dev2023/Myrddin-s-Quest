class PoisonStatusbar extends DrawableObject {
  POISON = [
    "img/game_ui/statusbars/statusbar-poison/0.png", // 0 Bild
    "img/game_ui/statusbars/statusbar-poison/20.png", // 20 Bild
    "img/game_ui/statusbars/statusbar-poison/40.png", // 40 Bild
    "img/game_ui/statusbars/statusbar-poison/60.png", // 60 Bild
    "img/game_ui/statusbars/statusbar-poison/80.png", // 80 Bild
    "img/game_ui/statusbars/statusbar-poison/100.png", // 100 Bild
  ];
  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.POISON);
    this.x = 2; 
    this.y = 75; // Position der Statusbar
    this.width = 190;  // Passe die Breite an
    this.height = 50;  // Passe die Höhe an
    this.setPercentage(0); // Initialize with 0%
  }
  
  setPercentage(percentage) {
    this.percentage = percentage;
    if (this.percentage > 100) {
      this.percentage = 100;
    }
    let path = this.POISON[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}