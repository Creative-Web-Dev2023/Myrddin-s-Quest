class Snake extends MovableObject {
  height = 150;
  width = 250;
  y = 300;
  isMoving = true; // Schlange bewegt sich immer
  direction = 'left';
  moveRange = 150; // Reduzierte Bewegungsreichweite
  startX = 400; // Angepasste Startposition
  isIdle = false; // Schlange ist nicht idle
  isAttacking = false; // Track if the snake is attacking
  isHurt = false;
  isDying = false;
  energy = 10; // Snake hat 20 Lebenspunkte
  speed = 0.5; // Reduce base speed
  otherDirection = 1; // Füge otherDirection hinzu, um die Bildrichtung zu korrigieren
  deathTimeout = null;

  offset = {
    top: 60,
    bottom: 60,
    left: 50,
    right: 50
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

  constructor(startX = 400, moveRange = 150, id) { 
    super();
    this.id = id; 
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage(this.IMAGES_WALKING[0]); 
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE); 
    this.loadImages(this.IMAGES_ATTACKING); 
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD); 
    this.animate();
  }

  animate() {
    setInterval(() => {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isDying) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTACKING);
        } else if (this.isIdle) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_WALKING); 
        }
    }, 200);

    setInterval(() => {
        if (!this.isDead() && this.isMoving) {
            if (this.direction === 'left') {
                if (this.x > this.startX - this.moveRange) { 
                    this.x -= this.speed;
                    this.otherDirection = true; // Schlange schaut nach links
                } else {
                    this.direction = 'right';
                }
            } else {
                if (this.x < this.startX) { 
                    this.x += this.speed;
                    this.otherDirection = false; // Schlange schaut nach rechts
                } else {
                    this.direction = 'left';
                }
            }
        }
    }, 1000 / 60);
}

  update() {
    this.x += this.speedX; 
  }
}
