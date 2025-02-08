class Door extends MovableObject {
  IMAGE_DOOR = [
    "img/door/door 0.png",
    "img/door/door 1.png",
    "img/door/door 2.png",
    "img/door/door 3.png",
    "img/door/door 4.png",
  ];

  constructor(x, y, id) {
    super();
    this.id = id;
    this.imageCache = {};
    this.loadImages(this.IMAGE_DOOR);
    this.x = 4500;
    this.y = y;
    this.width = 300;
    this.height = 460;
    this.offset = { top: 0, bottom: 250, left: 200, right: 200 };
    this.img = this.imageCache[this.IMAGE_DOOR[0]];
    this.animate();
  }

  loadImages(images) {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      this.imageCache[src] = img;
    });
  }

  animate() {
    let currentImageIndex = 0;
    setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[currentImageIndex]];
      currentImageIndex = (currentImageIndex + 1) % this.IMAGE_DOOR.length;
    }, 1000 / 4);
  }

  draw(ctx) {
    super.draw(ctx);
    this.drawFrame(ctx);
  }

  isCollidingWithDoor(character) {
    const box1 = this.getCollisionBox();
    const box2 = character.getCollisionBox();
    const isColliding =
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y;

    return isColliding;
  }

  enterDoor(character) {
    character.enterDoor(this);
  }

  animateOpening() {
    let doorOpenFrame = 0;
    const openInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGE_DOOR[doorOpenFrame]];
      doorOpenFrame++;
      if (doorOpenFrame >= this.IMAGE_DOOR.length) clearInterval(openInterval);
    }, 100);
  }

  static drawDoor(world) {
    if (world.door) {
      world.door.drawFrame(world.ctx);
    }
  }
}
