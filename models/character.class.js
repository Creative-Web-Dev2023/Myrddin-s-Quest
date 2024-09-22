class Character extends MovableObject{
    height =290;
    width = 510; 
     x = 0; // x ist die Position des Charakters auf der x-Achse
     y = 146;

    IMAGES_WALKING = ['img/wizard/walk/walk_001.png',
                        'img/wizard/walk/walk_002.png',
                        'img/wizard/walk/walk_003.png',
                        'img/wizard/walk/walk_004.png',
                        'img/wizard/walk/walk_005.png',
                        'img/wizard/walk/walk_006.png',
                        'img/wizard/walk/walk_007.png',
                        'img/wizard/walk/walk_008.png',
                        'img/wizard/walk/walk_009.png',];
          
    

    constructor(){
        super().loadImage('img/wizard/walk/walk_000.png');
        this.loadImages(this.IMAGES_WALKING); 
        this.animate();
    }
    animate(){
        setInterval(() => {
        let i = this.currentImage % this.IMAGES_WALKING.length; //let i =0 % 9 = 0; 1%9 = 1; 2%9 = 2; 3%9 = 3; 4%9 = 4; 5%9 = 5; 6%9 = 6; 7%9 = 7; 8%9 = 8; 9%9 = 0
        // i=0,1,2,3,4,5,6,7,8, 0, 1,2,3,4,5,6,7,8, 0,1,2 usw.
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }, 150);          
    }
    
    jump(){
        
    }
}