class StatusBar extends DrawableObject {
  HEALTH = [
    "img/game_ui/statusbars/statusbar-health/0.png", // 0 image
    "img/game_ui/statusbars/statusbar-health/20.png",
    "img/game_ui/statusbars/statusbar-health/40.png",
    "img/game_ui/statusbars/statusbar-health/60.png",
    "img/game_ui/statusbars/statusbar-health/80.png",
    "img/game_ui/statusbars/statusbar-health/100.png", // 6 image
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.HEALTH); // Load the images
    this.x = 2; // Position of the status bar
    this.y = 10; // Position of the status bar
    this.width = 190; // Adjust the width
    this.height = 50; // Adjust the height
    this.setPercentage(100); // Set the status bar to 100% at the beginning
  }

  setPercentage(percentage) { // Set the percentage value
    this.percentage = percentage; // Set the percentage value
    let path = this.HEALTH[this.resolveImageIndex()]; // Set image path based on the percentage value
    this.img = this.imageCache[path]; // Set the image
  }

  resolveImageIndex() { // Resolve the image index based on the percentage value
    if (this.percentage >= 100) { // Check if the percentage is greater than or equal to 100
      return 5; // Return 5
    } else if (this.percentage >= 80) { // Check if the percentage is greater than or equal to 80
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

  setHealth(health) {
    this.healthElement.style.width = health + "%"; // Aktualisiere die Breite der Statusleiste
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

  constructor() {
    super();
    this.loadImages(this.IMAGES); 
    this.x = 2; 
    this.y = 50; 
    this.width = 190;
    this.height = 50; 
    this.setPercentage(0); 
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
    "img/game_ui/statusbars/statusbar-endboss/0.png",
    "img/game_ui/statusbars/statusbar-endboss/20.png",
    "img/game_ui/statusbars/statusbar-endboss/40.png",
    "img/game_ui/statusbars/statusbar-endboss/60.png",
    "img/game_ui/statusbars/statusbar-endboss/80.png",
    "img/game_ui/statusbars/statusbar-endboss/100.png",
  ];
  percentage = 100; 

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.y = 510;
    this.width = 190; 
    this.height = 50; 
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
}