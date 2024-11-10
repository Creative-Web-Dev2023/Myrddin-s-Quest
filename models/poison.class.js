class PoisonObject extends CollectableObject{
    width=80;
    height=80;

    IMAGES = [
        'img/poison/1.png',
        'img/poison/2.png',
        'img/poison/3.png',
        'img/poison/4.png',
        'img/poison/5.png',
        'img/poison/6.png',
        'img/poison/7.png',
        'img/poison/8.png',

    ]; 

    constructor(x, y){
        super();
        this.loadImages(this.IMAGES);
        this.x=x;
        this.y=y;
        this.animate();
    }  }
