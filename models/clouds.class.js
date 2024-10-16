class Cloud extends MovableObject{
    y = 20;
    height = 100;
    width = 200;
    
    drawRectangle = false;

    constructor(){
        super().loadImage('img/clouds/1.png'); // Zufällig ein Bild aus der Liste auswählen
         this.x =  Math.random() * 500; //Zahlen zwischen 200 und 700 zufällig generierte Zahl
         this.animate();
    }
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 80); // Bewegt die Cloud 60 mal pro Sekunde (60 FPS)
    }
}



