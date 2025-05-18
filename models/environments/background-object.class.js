class Background extends MovableObject {
  offset = { top: 0, bottom: 0, left: 0, right: 0 };
  constructor(imageObject, x) {
    super();
    this.img = imageObject;
    this.x = x;
    this.width = 960;
    this.height = 540;
  }
}