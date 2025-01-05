class Snake extends MovableObject {
    width = 80;
    height = 80;
    y = 350;
    speed = 0.5;

    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    IMAGES_WALKING = [
        'img/snake/walk/Walk1.png',
        'img/snake/walk/Walk2.png',
        'img/snake/walk/Walk3.png',
        'img/snake/walk/Walk4.png',
    ];

    IMAGES_IDLE = [
        'img/snake/idle/idle 000.png',
        'img/snake/idle/idle 001.png',
        'img/snake/idle/idle 002.png',
        'img/snake/idle/idle 003.png',
    ];

    IMAGES_ATTACKING = [
        'img/snake/attack/attack 000.png',
        'img/snake/attack/attack 001.png',
        'img/snake/attack/attack 002.png',
        'img/snake/attack/attack 003.png',
    ];
    IMAGES_HURT = [
        'img/snake/hurt/hurt 000.png',
        'img/snake/hurt/hurt 001.png',
    ];

    IMAGES_DEAD = [
        'img/snake/die/die 000.png',
        'img/snake/die/die 001.png',
        'img/snake/die/die 002.png',
        'img/snake/die/die 003.png',
    ];

    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.otherDirection = true;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACKING);
            } else if (this.speed == 0) {
                this.playAnimation(this.IMAGES_IDLE);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    isDead() {
        return this.energy <= 0;
    }
}
