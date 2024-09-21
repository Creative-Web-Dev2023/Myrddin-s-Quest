class Knight extends MovableObject{
    height =270;
    width = 500; 
     y =240;
    constructor(){
        super().loadImage('img/knight/walk/walk 000.png');
        this.x = 200 + Math.random() * 500;
        
    }
}