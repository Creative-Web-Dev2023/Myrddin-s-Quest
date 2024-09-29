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
  walking_sound = new Audio('audio/walking.mp3');  

    constructor(){ // constructor bedeutet dass die function aufgerufen wird wenn ein neues Objekt erstellt wird
        super().loadImage('img/wizard/walk/walk_000.png');
        this.loadImages(this.IMAGES_WALKING); 
        this.animate();
    }

    animate(){ // laufende Animation
       setInterval(() => {
        this.walking_sound.pause();
        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { // der character kann nicht über den Rand hinausgehen
        this.x += this.speed;
        this.otherDirection = false;    
        this.walking_sound.play();
        }

        if(this.world.keyboard.LEFT && this.x > 0) { // der character kann nicht über den Rand hinausgehen
            this.x -= this.speed;
            this.otherDirection = true;
            this.walking_sound.play();
            }
            this.world.camera_x = -this.x - 190;
         }, 1000 / 60); //60x pro Sekunde

        setInterval(() => {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { //walk animation
              this.playAnimation(this.IMAGES_WALKING);
            }
        }, 50);          
    }
    
    jump(){
        
    }
}
