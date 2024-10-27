class Knight extends MovableObject {
    height = 270;
    width = 500;
    y = 240; // Die Höhe des Ritter
    isMoving = false; // Neue Variable, um die Bewegung zu steuern
    delay = 3000; // Wartezeit von 3 Sekunden

    offset = {
        top: 80,    // Reduziert das Rechteck von oben
        bottom: 80, // Reduziert das Rechteck von unten
        left: 200,   // Reduziert das Rechteck von links
        right: 200  // Reduziert das Rechteck von rechts
      };
    
    IMAGES_WALKING = [
        'img/knight/walk/walk_0.png',
        'img/knight/walk/walk_1.png',
        'img/knight/walk/walk_2.png',
        'img/knight/walk/walk_3.png',
        'img/knight/walk/walk_4.png',
        'img/knight/walk/walk_5.png',
    ];

    constructor() {
        super();
        this.x = 800 + Math.random() * 500;
        this.loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.2;
        setTimeout(() => {
            this.isMoving = true;
        }, this.delay);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isMoving) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 500); // 
    }
}
    

