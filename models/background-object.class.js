class BackgroundObject extends MovableObject{
    
    width = 720;
    height = 500;

    constructor(imagePath, x, y = 480 - 500) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(imagePath);
        
    }
}