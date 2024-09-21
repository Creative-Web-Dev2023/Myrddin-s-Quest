class Cloud extends MovableObject{
    y = 20;
    height = 100;
    width = 200;

    constructor(){
        super().loadImage('img/clouds/2.png'); // Zufällig ein Bild aus der Liste auswählen
    
         this.x =  Math.random() * 500; //Zahlen zwischen 200 und 700 zufällig generierte Zahl
         this.animate();
    }
animate(){
        setInterval(() =>{
            this.x = this.x - 0.15;//  die X-Koordinate wird um 0.15 nach links verschoben
        }, 1000 / 60); // 60x pro Sekunde
    }
}
