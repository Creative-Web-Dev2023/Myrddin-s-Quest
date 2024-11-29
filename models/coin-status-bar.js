class CoinStatusBar extends DrawableObject {
  IMAGES = [
    'img/game_ui/statusbars/statusbar-coins/0.png',
    'img/game_ui/statusbars/statusbar-coins/20.png',
    'img/game_ui/statusbars/statusbar-coins/40.png',
    'img/game_ui/statusbars/statusbar-coins/60.png',
    'img/game_ui/statusbars/statusbar-coins/80.png',
    'img/game_ui/statusbars/statusbar-coins/100.png',
  ];
  
  percentage = 0; // Start with an empty status bar
  totalCoins = 20; // Maximale Anzahl der Münzen
  currentCoins = 0; // Anzahl der gesammelten Münzen
  
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 2; 
    this.y = 45; // Position der Statusbar
    this.width = 190;  // Passe die Breite an
    this.height = 50;  // Passe die Höhe an
    this.setPercentage(0); // Initialize with 0%
  }
  
  // Methode zur Aktualisierung des Prozentsatzes
  setPercentage(coins) {
    this.currentCoins = coins;
    this.percentage = (this.currentCoins / this.totalCoins) * 100; // Umrechnung der Münzen in Prozentsatz
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

  // Funktion zum Sammeln der Münzen und Aktualisieren der Statusbar
  collectCoin() {
    this.setPercentage(this.currentCoins + 1); // Eine Münze sammeln
  }
}

