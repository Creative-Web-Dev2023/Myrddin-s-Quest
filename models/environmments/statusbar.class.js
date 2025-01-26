class StatusBar extends DrawableObject {
  HEALTH = [
    "img/game_ui/statusbars/statusbar-health/0.png", 
    "img/game_ui/statusbars/statusbar-health/20.png",
    "img/game_ui/statusbars/statusbar-health/40.png",
    "img/game_ui/statusbars/statusbar-health/60.png",
    "img/game_ui/statusbars/statusbar-health/80.png",
    "img/game_ui/statusbars/statusbar-health/100.png", 
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.HEALTH); 
    this.x = 2; 
    this.y = 10; 
    this.width = 190; 
    this.height = 50; 
    this.setPercentage(100); 
  }

  setPercentage(percentage) { 
    this.percentage = percentage; 
    let path = this.HEALTH[this.resolveImageIndex()]; 
    this.img = this.imageCache[path]; 
  }

  resolveImageIndex() { 
    if (this.percentage >= 100) { 
      return 5; // Return 5
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

  setHealth(health) {
    this.healthElement.style.width = health + "%"; 
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
    this.y = 710;
    this.width = 170; 
    this.height = 40; 
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