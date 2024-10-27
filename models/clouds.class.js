class Cloud extends MovableObject {
    x = 90;
    y = 9;
    height = 200;
    width = 600;
    drawRectangle = false;
    speed= 0.2;

    constructor() {
        super().loadImage('img/clouds/full.png');
        this.x = Math.random() * 2400;
        // this.y = Math.random() * 90;
        this.animate();
    }

    animate() {
     this.moveLeft();   
        
}
moveLeft() {
    setInterval(() => {
        this.x -= this.speed;
    }, 1000 / 60);
}
}
