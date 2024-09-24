class Character extends MovableObject{
    height =290;
    width = 510; 
     x = 0; // x ist die Position des Charakters auf der x-Achse
     y = 146;
     speed = 10;
   

    IMAGES_WALKING = ['img/wizard/walk/walk_001.png',
                        'img/wizard/walk/walk_002.png',
                        'img/wizard/walk/walk_003.png',
                        'img/wizard/walk/walk_004.png',
                        'img/wizard/walk/walk_005.png',
                        'img/wizard/walk/walk_006.png',
                        'img/wizard/walk/walk_007.png',
                        'img/wizard/walk/walk_008.png',
                        'img/wizard/walk/walk_009.png',];
  world;
    

    constructor(){ // constructor bedeutet dass die function aufgerufen wird wenn ein neues Objekt erstellt wird


        super().loadImage('img/wizard/walk/walk_000.png');
        this.loadImages(this.IMAGES_WALKING); 
        this.animate();
    }

    animate(){
       setInterval(() => {
        if(this.world.keyboard.RIGHT) {
        this.x += this.speed;
        this.otherDirection = false;    
        }
        if(this.world.keyboard.LEFT) {
            this.x -= this.speed;
            this.otherDirection = true;
            }
         }, 1000 / 60); //60x pro Sekunde

        setInterval(() => {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
           
                //walk animation
               let i = this.currentImage % this.IMAGES_WALKING.length; //% bedeutet dass der Rest der Division genommen wird
               let path = this.IMAGES_WALKING[i];
               this.img = this.imageCache[path];
               this.currentImage++;
            }
        }, 50);          
    }
    
    jump(){
        
    }
}
