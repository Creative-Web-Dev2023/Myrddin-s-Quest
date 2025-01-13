// Import the Enemy class
class Endboss extends Enemy {
    constructor() {
        super();
        this.height = 600;
        this.width = 450;
        this.y = -100;
        this.x = 3500;
        this.speed = 5;
        this.deadSound = new Audio('audio/troll dead.mp3');
        this.offset = { top: 180, bottom: 65, left: 90, right: 90 };
        this.IMAGES_WALKING = [
            'img/troll/idle/idle_000.png',
            'img/troll/idle/idle_001.png',
            'img/troll/idle/idle_002.png',
            'img/troll/idle/idle_003.png',
            'img/troll/idle/idle_004.png',
            'img/troll/idle/idle_005.png',
            'img/troll/idle/idle_006.png',
            'img/troll/idle/idle_007.png',
            'img/troll/idle/idle_008.png',
            'img/troll/idle/idle_009.png',
        ];
        this.IMAGES_ATTACKING = [
            'img/troll/attack/attack_000.png',
            'img/troll/attack/attack_001.png',
            'img/troll/attack/attack_002.png',
            'img/troll/attack/attack_003.png',
            'img/troll/attack/attack_004.png',
            'img/troll/attack/attack_005.png',
            'img/troll/attack/attack_006.png',
            'img/troll/attack/attack_007.png',
            'img/troll/attack/attack_008.png',
            'img/troll/attack/attack_009.png',
        ];
        this.IMAGES_HURT = [
            'img/troll/hurt/hurt_000.png',
            'img/troll/hurt/hurt_001.png',
            'img/troll/hurt/hurt_002.png',
            'img/troll/hurt/hurt_003.png',
            'img/troll/hurt/hurt_004.png',
            'img/troll/hurt/hurt_005.png',
            'img/troll/hurt/hurt_006.png',
            'img/troll/hurt/hurt_007.png',
            'img/troll/hurt/hurt_008.png',
            'img/troll/hurt/hurt_009.png',
        ];
        this.IMAGES_DEAD = [
            'img/troll/die/die_000.png',
            'img/troll/die/die_001.png',
            'img/troll/die/die_002.png',
            'img/troll/die/die_003.png',
            'img/troll/die/die_004.png',
            'img/troll/die/die_005.png',
            'img/troll/die/die_006.png',
            'img/troll/die/die_007.png',
            'img/troll/die/die_008.png',
            'img/troll/die/die_009.png',
        ];
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    playDeadSound() {
        this.deadSound.play();
    }

    attackCharacter(character) {
        if (this.energy > 0 && !this.isAttacking) {
            this.isAttacking = true;
            character.takeDamage(20);
            this.playAnimation(this.IMAGES_ATTACKING);
            setTimeout(() => {
                this.isAttacking = false;
            }, 1000);
        }
    }

   
}



