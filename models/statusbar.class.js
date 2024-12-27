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
class PoisonStatusBar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-poison/0.png",
    "img/game_ui/statusbars/statusbar-poison/20.png",
    "img/game_ui/statusbars/statusbar-poison/40.png",
    "img/game_ui/statusbars/statusbar-poison/60.png",
    "img/game_ui/statusbars/statusbar-poison/80.png",
    "img/game_ui/statusbars/statusbar-poison/100.png",
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
    "img/game_ui/statusbars/statusbar-knight/0.png",
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

class KnightStatusBar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-knight/0.png",
    "img/game_ui/statusbars/statusbar-knight/20.png",
    "img/game_ui/statusbars/statusbar-knight/40.png",
    "img/game_ui/statusbars/statusbar-knight/60.png",
    "img/game_ui/statusbars/statusbar-knight/80.png",
    "img/game_ui/statusbars/statusbar-knight/100.png",
  ];

  percentage = 100; // Start with a full status bar

  constructor(knight) {
    super();
    this.loadImages(this.IMAGES);
    this.x = knight.x; // Passe die x-Koordinate an, um sie über dem Ritter zu positionieren
    this.y = knight.y - 60; // Passe die y-Koordinate an, um sie über dem Ritter zu positionieren
    this.width = 190; // Passe die Breite an
    this.height = 50; // Passe die Höhe an
    this.setPercentage(100); // Setzt die Statusbar zu Beginn auf 100%
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
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}