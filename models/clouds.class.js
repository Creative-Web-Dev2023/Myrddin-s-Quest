class Cloud extends MovableObject {
    x = 90;
    y = 10;
    height = 200;
    width = 700;
    drawRectangle = false;

    constructor() {
        super().loadImage(this.getRandomCloudImage()); // Zufällig ein Bild aus der Liste auswählen
        this.x = Math.random() * 2100; // Größerer Bereich für die X-Position
        this.y = Math.random() * 90; // Kleinere Bereich für die Y-Position
  
    }

    // Funktion zum zufälligen Auswählen eines Wolkenbildes
    getRandomCloudImage() {
        const images = [
            'img/clouds/full.png', // Füge hier weitere Wolkenbilder hinzu
        ];
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }
}
