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
    this.loadImages(this.IMAGES); // Load the images
    this.x = 2; // Position of the status bar
    this.y = 50; // Reduce the space between the status bars further
    this.width = 190; // Adjust the width
    this.height = 50; // Adjust the height
    this.setPercentage(0); // Initialize with 0%
  }

  setPercentage(percentage) { // Set the percentage value
    this.percentage = percentage;
    let path = this.IMAGES[this.calculateImageIndex()]; // Set image path based on the percentage value
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

  increasePercentage(amount) { // Increase the percentage value
    this.percentage = Math.min(100, this.percentage + amount); // Increase the percentage value
    this.setPercentage(this.percentage); // Set the percentage value
  }
}

class EndbossStatusbar extends DrawableObject {
  IMAGES = [
    "img/game_ui/statusbars/statusbar-knight/0.png",
    "img/game_ui/statusbars/statusbar-knight/20.png",
    "img/game_ui/statusbars/statusbar-knight/40.png",
    "img/game_ui/statusbars/statusbar-knight/60.png",
    "img/game_ui/statusbars/statusbar-knight/80.png",
    "img/game_ui/statusbars/statusbar-knight/100.png",
  ];

  percentage = 100; // Start with a full status bar

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 0;
    this.y = 0; // Position of the status bar
    this.width = 190; // Adjust the width
    this.height = 50; // Adjust the height
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
