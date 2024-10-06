class Knight extends MovableObject {
    height = 270;
    width = 500;
    y = 240; // Die Höhe des Ritters
    x = 200; // Die Breite des Ritters
    
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

    // Überschreibe die drawFrame Methode für den Knight
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'red'; // Du kannst eine andere Farbe für den Knight-Rahmen wählen
        const frameWidth = this.width * 0.3;  // 10% schmaler als das Bild
        const frameHeight = this.height * 0.4; // 30% niedriger als das Bild
        const xOffset = (this.width - frameWidth) / 2; // 5% auf jeder Seite
        const yOffset = (this.height - frameHeight) / 2; // 15% oben und unten

        ctx.rect(
            this.x + xOffset, // Linke obere Ecke X
            this.y + yOffset, // Linke obere Ecke Y
            frameWidth,       // Angepasste Breite
            frameHeight       // Angepasste Höhe
        );
        ctx.stroke();
        ctx.closePath();
    }
}
