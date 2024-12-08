class StatusBar extends DrawableObject {
  HEALTH = [
    "img/game_ui/statusbars/statusbar-health/0.png", // 0 Bild
    "img/game_ui/statusbars/statusbar-health/20.png",
    "img/game_ui/statusbars/statusbar-health/40.png",
    "img/game_ui/statusbars/statusbar-health/60.png",
    "img/game_ui/statusbars/statusbar-health/80.png",
    "img/game_ui/statusbars/statusbar-health/100.png", // 6 Bild
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.HEALTH);
    this.x = 2;
    this.y = 10; // Position der Statusbar
    this.width = 190; // Passe die Breite an
    this.height = 50; // Passe die Höhe an
    this.setPercentage(100); // Setzt die Statusbar zu Beginn auf 100%
  }

  setPercentage(percentage) {
    this.percentage = percentage; // Setzt den Prozentwert
    let path = this.HEALTH[this.resolveImageIndex()]; // Bild-Pfad anhand des Prozentwerts setzen
    this.img = this.imageCache[path]; // Bild setzen
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

class CoinStatusBar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-coins/0.png",
    "img/game_ui/statusbars/statusbar-coins/20.png",
    "img/game_ui/statusbars/statusbar-coins/40.png",
    "img/game_ui/statusbars/statusbar-coins/60.png",
    "img/game_ui/statusbars/statusbar-coins/80.png",
    "img/game_ui/statusbars/statusbar-coins/100.png",
  ];

  percentage = 0; // Start with an empty status bar
  totalCoins = 20; // Maximale Anzahl der Münzen
  currentCoins = 0; // Anzahl der gesammelten Münzen

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 2;
    this.y = 45; // Position der Statusbar
    this.width = 190; // Passe die Breite an
    this.height = 50; // Passe die Höhe an
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
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
  // Funktion zum Sammeln der Münzen und Aktualisieren der Statusbar
  collectCoin() {
    this.setPercentage(this.currentCoins + 1); // Eine Münze sammeln
  }
}

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
    this.width = 190; // Passe die Breite an
    this.height = 50; // Passe die Höhe an
    this.setPercentage(0); // Initialize with 0%
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.calculateImageIndex()];
    this.img = this.imageCache[path];
  }

  calculateImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  increasePercentage(amount) {
    this.percentage = Math.min(100, this.percentage + amount);
    this.setPercentage(this.percentage);
  }
}
class EndbossStatusbar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-health/0.png",
    "img/game_ui/statusbars/statusbar-health/20.png",
    "img/game_ui/statusbars/statusbar-health/40.png",
    "img/game_ui/statusbars/statusbar-health/60.png",
    "img/game_ui/statusbars/statusbar-health/80.png",
    "img/game_ui/statusbars/statusbar-health/100.png",
  ];

  percentage = 100; // Start with a full status bar

  constructor(endboss) {
    super();
    this.loadImages(this.IMAGES);
    this.x = 2;
    this.y = 10; // Position der Statusbar
    this.width = 190; // Passe die Breite an
    this.height = 50; // Passe die Höhe an
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.calculateImageIndex()];
    this.img = this.imageCache[path];
  }

  calculateImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
