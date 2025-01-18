class ThrowableObject extends MovableObject {
  constructor(x, y, targetX) {
    super().loadImage('img/poison/1.png');
    this.x = x;
    this.y = y;
    this.targetX = targetX; 
    this.width = 45; 
    this.height = 45; 
    this.speed = 5; 
    this.throw(); 
  }

  throw() {
    this.applyGravity();
    setInterval(() => {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.speedY -= 1; // Gravity effect
    }, 25);
  }
}



