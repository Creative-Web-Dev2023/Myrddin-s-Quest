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
        this.playAnimation(this.IMAGES_WALKING);
        
    }, 300);          
    }
}

