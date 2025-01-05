class Endboss extends MovableObject {
    height = 600;  // Höhe des Endbosses
    width = 450;   // Breite des Endbosses
    y = -100;      // y-Position
    x = 3500;      // x-Position des Endbosses geändert
    speed =5;
    lastHit = 0; // Zeitpunkt des letzten Treffers
    deadSound = new Audio('audio/troll dead.mp3'); // Neuer Sound für den Tod des Endbosses
    isAttacking = false; // Endboss greift an
    offset = {
        top: 180,    // Reduziert das Rechteck von oben
        bottom: 65, // Reduziert das Rechteck von unten
        left: 90,   // Reduziert das Rechteck von links
        right: 90   // Reduziert das Rechteck von rechts
      };

    IMAGES_WALKING = [
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
    IMAGES_ATTACK= [
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
    IMAGES_HURT = [
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

    IMAGES_DEAD = [
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

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    getCollisionBox() {
        return super.getCollisionBox('endboss');
    }

    draw(ctx) {
        super.draw(ctx);
    }

    playDeadSound() {
        this.deadSound.play();
    }
  
    animate(character) {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
            if (this.isDead()) {
                this.playDeadSound();
            }
        }, 100);
    }

    attackCharacter(character) {
        if (this.health > 0 && !this.isAttacking) {
          this.isAttacking = true;
          character.takeDamage(20); // Boss greift den Charakter an
          this.playAnimation(this.IMAGES_ATTACKING);
          setTimeout(() => {
            this.isAttacking = false;
          }, 1000); // Boss-Angriff dauert 1 Sekunde
        }
      }
    
      takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
          this.die();
        }
      }
    
      die() {
        this.isDead = true;
        this.playAnimation(this.IMAGES_DEAD); // Zeige Tod-Animation des Bosses
        setTimeout(() => {
          this.removeBoss(); // Entferne den Boss nach dem Tod
        }, 3000); // Verzögert das Entfernen um 3 Sekunden
      }
    
      removeBoss() {
        if (this.world) {
          this.world.removeObject(this); // Entferne den Boss aus der Welt
        }
      }
    }



