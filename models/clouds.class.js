class Cloud extends MovableObject{
    y = 20;
    height = 100;
    width = 200;
    speed = 0.15 + Math.random() * 0.15;
    drawRectangle = false;

    constructor(){
        super().loadImage('img/clouds/2.png'); // Zufällig ein Bild aus der Liste auswählen
         this.x =  Math.random() * 500; //Zahlen zwischen 200 und 700 zufällig generierte Zahl
         this.animate();
    }
animate(){
       this.moveLeft();
    }


}
