class MovableObject {
  x = 120;
  y = 280;
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
