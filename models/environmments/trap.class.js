class Trap extends MovableObject {
  height = 180;
  width = 180;
  isActive = false;
  IMAGES_IDLE = [
    "img/obstacles/trap/trap1.png",
    "img/obstacles/trap/trap2.png",
    "img/obstacles/trap/trap3.png",
    "img/obstacles/trap/trap4.png",
    "img/obstacles/trap/trap5.png",
    "img/obstacles/trap/trap6.png",
  ];

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_IDLE);
    }, 100);
  }

  static drawTraps(ctx, traps, camera_x) {
    traps.forEach((trap) => {
      if (typeof trap.draw === "function") {
        trap.draw(ctx, camera_x);
      } else {
        console.error("Das Objekt hat keine gültige draw-Methode:", trap);
      }
    });
  }
  setWorld(world) {
    this.world = world;
  }
}
