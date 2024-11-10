class PoisonStatusbar extends DrawableObject {
  POISON = [
    "img/game_ui/statusbars/statusbar-poison/0 .png", // 0 Bild
    "img/game_ui/statusbars/statusbar-poison/20 .png",
    "img/game_ui/statusbars/statusbar-poison/40 .png",
    "img/game_ui/statusbars/statusbar-poison/60 .png",
    "img/game_ui/statusbars/statusbar-poison/80.png",
    "img/game_ui/statusbars/statusbar-poison/100.png", // 6 Bild
  ];
  percetage = 0;

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
    let path = this.POISON[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
}