class MovableObject {
  x = 180;
  y = 250;
  img;
  height = 150;
  width = 280;

  //loadImage ('img/test.png');
  loadImage(path) {
    this.img = new Image(); // ist das gleiche wie this.img=document.createElement('img')
    this.img.src = path;
  }
  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {}
}
