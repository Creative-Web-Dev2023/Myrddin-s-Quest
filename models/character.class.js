class Character extends MovableObject{
    height =290;
    width = 510; 
     x = 0; // x ist die Position des Charakters auf der x-Achse
     y = 147;
    constructor(){
        super().loadImage('img/wizard/walk/walk_000.png');
        this.loadImages(['img/wizard/walk/walk_001.png',
                            'img/wizard/walk/walk_002.png',
                            'img/wizard/walk/walk_003.png',
                            'img/wizard/walk/walk_004.png',
                            'img/wizard/walk/walk_005.png',
                            'img/wizard/walk/walk_006.png',
                            'img/wizard/walk/walk_007.png',
                            'img/wizard/walk/walk_008.png',
                            'img/wizard/walk/walk_009.png'
                        ]); 
        this.animate();
    }
    animate(){
        setInterval(() => {
            this.moveRight();
        }, 1000/16);
    }
    
    jump(){
        
    }
}