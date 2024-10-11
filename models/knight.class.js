class Knight extends MovableObject {
    height = 270;
    width = 500;
    y = 240; // Die Höhe des Ritters
    x = 200; // Die Breite des Ritters

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
        super().loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 300);
    }
    
}
