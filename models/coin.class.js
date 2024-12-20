class Coin extends MovableObject {
  // ...existing code...

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  // ...existing code...
}
