class Endboss extends MovableObject {
    height = 600;  // Höhe des Endbosses
    width = 450;   // Breite des Endbosses
    y = -100;      // y-Position
    x = 3500;      // x-Position des Endbosses geändert
    energy = 100;  // Setze die Energie des Endbosses auf 100
    statusBar; // Statusleiste für den Endboss
   
    offset = {
        top: 180,    // Reduziert das Rechteck von oben
        bottom: 65, // Reduziert das Rechteck von unten
        left: 90,   // Reduziert das Rechteck von links
        right: 90   // Reduziert das Rechteck von rechts
      };

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

    IMAGES_HURT = [
        'img/troll/hurt/hurt_000.png',
        'img/troll/hurt/hurt_001.png',
        'img/troll/hurt/hurt_002.png',
        'img/troll/hurt/hurt_003.png',
        'img/troll/hurt/hurt_004.png',
        'img/troll/hurt/hurt_005.png',
        'img/troll/hurt/hurt_006.png',
        'img/troll/hurt/hurt_007.png',
        'img/troll/hurt/hurt_008.png',
        'img/troll/hurt/hurt_009.png',
    ];

    IMAGES_DEAD = [
        'img/troll/die/die_000.png',
        'img/troll/die/die_001.png',
        'img/troll/die/die_002.png',
        'img/troll/die/die_003.png',
        'img/troll/die/die_004.png',
        'img/troll/die/die_005.png',
        'img/troll/die/die_006.png',
        'img/troll/die/die_007.png',
        'img/troll/die/die_008.png',
        'img/troll/die/die_009.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.statusBar = new EndbossStatusbar(); // Initialisiere die Statusleiste
        this.statusBar.setPercentage(this.energy); // Setze die Energie der Statusleiste
        this.animate();
    }

    getCollisionBox() {
        return super.getCollisionBox('endboss');
    }

    draw(ctx) {
        super.draw(ctx);
        this.statusBar.x = this.x + this.width / 2 - 95; // Korrigieren Sie die Position der Statusleiste
        this.statusBar.y = this.y - 50; // Korrigieren Sie die Position der Statusleiste
        this.statusBar.draw(ctx); // Zeichne die Statusleiste über dem Kopf des Endbosses
        this.drawFrame(ctx); // Zeichne die Kollisionsbox
    }

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'violet'; // Ändern Sie die Farbe der Kollisionsbox
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
        ctx.stroke();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }

}