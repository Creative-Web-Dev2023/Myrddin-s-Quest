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

    constructor(delay=0, startX =800) { // Verzögerung von 0 Sekunden
        super();
        this.x = startX; // Setzt die individuelle Startposition
        this.loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.15 + Math.random() * 0.25;

        setTimeout(() => {
            this.isMoving = true;
            this.animate();
        }, delay);
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
    

