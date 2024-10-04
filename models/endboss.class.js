class Endboss extends  MovableObject{

    height = 600;
    width = 450; 
    y = -100;
    x = 2500;

    IMAGES_WALKING = [
        'img/troll/idle/idle_000.png',
        'img/troll/idle/idle_001.png',
        'img/troll/idle/idle_002.png',
        'img/troll/idle/idle_003.png',
        'img/troll/idle/idle_004.png',
        'img/troll/idle/idle_005.png',
        'img/troll/idle/idle_006.png',
        'img/troll/idle/idle_007.png',
        'img/troll/idle/idle_008.png',
        'img/troll/idle/idle_009.png',
    ];

    constructor (){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING); // lädt alle Bilder
        this.animate();
    }
animate() {
    setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
    }, 100);
}
}
