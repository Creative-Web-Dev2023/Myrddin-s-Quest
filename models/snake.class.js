// ...ursprünglicher Code vor der Klasse Snake...

class Snake extends MovableObject {
    height = 100;
    width = 150;
    y = 350;
    isMoving = false;
    direction = 'left';
    moveRange = 200; // Standardbewegungsbereich
    startX = 800; // Startposition

    offset = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    };

    IMAGES_WALKING = [
        'img/snake/walk/Walk1.png',
        'img/snake/walk/Walk2.png',
        'img/snake/walk/Walk3.png',
        'img/snake/walk/Walk4.png',
    ];

    constructor(startX = 800, moveRange = 200) {
        super();
        this.x = startX;
        this.startX = startX;
        this.moveRange = moveRange;
        this.otherDirection = false;
        this.loadImage('img/snake/walk/Walk1.png'); // Stellen Sie sicher, dass dieser Pfad korrekt ist
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.1 + Math.random() * 0.2;

        this.isMoving = true;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isMoving) {
                if (this.direction === 'left') {
                    this.moveLeft();
                    if (this.x <= this.startX - this.moveRange) {
                        this.direction = 'right';
                        this.otherDirection = false; // Richtungswechsel
                    }
                } else {
                    this.moveRight();
                    if (this.x >= this.startX + this.moveRange) {
                        this.direction = 'left';
                        this.otherDirection = true; // Richtungswechsel
                    }
                }
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 5);
    }
}

