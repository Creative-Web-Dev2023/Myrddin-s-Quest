class Knight extends MovableObject{
    height =270;
    width = 500; 
    y =240;
   IMAGES_WALKING = [   'img/knight/walk/walk_0.png',
                        'img/knight/walk/walk_1.png',
                        'img/knight/walk/walk_2.png',
                        'img/knight/walk/walk_3.png',
                        'img/knight/walk/walk_4.png',
                        'img/knight/walk/walk_5.png',
                    ];

    constructor(){
        super().loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5; 
        // die Geschwindigkeit varriert zwischen 0.15 und 0.4
        this.animate();
    }
    animate(){
        this.moveLeft();
        
        setInterval(() => {
        let i = this.currentImage % this.IMAGES_WALKING.length; //let i =0 % 9 = 0; 1%9 = 1; 2%9 = 2; 3%9 = 3; 4%9 = 4; 5%9 = 5; 6%9 = 6; 7%9 = 7; 8%9 = 8; 9%9 = 0
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        
        this.currentImage++;
    }, 300);          
    }
}

