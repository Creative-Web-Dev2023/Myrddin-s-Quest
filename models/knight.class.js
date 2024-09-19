class Knight extends MovableObject{
    constructor(){
        super().loadImage('img/knight/walk/walk 000.png');
        this.x = 200 + Math.random() * 500;
        this.y = 320 ;  // Setzt den Ritter weiter nach unten (y-Koordinate)
    }
}