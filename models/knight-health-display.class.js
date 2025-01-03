class KnightHealthDisplay extends DrawableObject {
    IMAGES_HEARTS = [
        'img/game_ui/heart_empty.png',
        'img/game_ui/heart_full.png'
    ];
    
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEARTS);
        this.x = 0;
        this.y = 0;
        this.width = 120; // Breite für 3 Herzen
        this.height = 30;
    }

    draw(ctx) {
        let heartDistance = 40; // Abstand zwischen den Herzen
        for (let i = 0; i < 3; i++) {
            if (this.energy > i * 10) { // Jedes Herz repräsentiert 10 Energie
                ctx.drawImage(this.imageCache[this.IMAGES_HEARTS[1]], this.x + (i * heartDistance), this.y, 30, 30);//
            } else {
                ctx.drawImage(this.imageCache[this.IMAGES_HEARTS[0]], this.x + (i * heartDistance), this.y, 30, 30);
            }
        }
    }

    updatePosition(knightX, knightY) {
        this.x = knightX + 140; // Position über dem Knight
        this.y = knightY ;  // 50 Pixel über dem Knight
    }
} 