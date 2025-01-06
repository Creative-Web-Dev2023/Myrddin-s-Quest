class Snake extends MovableObject {
  height = 150;
  width = 250;
  y = 350;
  isMoving = true; // Schlange bewegt sich immer
  direction = 'right';
  moveRange = 200; // Standardbewegungsbereich
  startX = 1200; // Startposition geändert, damit die Schlange von rechts kommt
  isIdle = false; // Schlange ist nicht idle
  isAttacking = false; // Track if the snake is attacking
  energy = 10; // Snake hat 20 Lebenspunkte
  speed = 0.015; // Reduce base speed

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

  IMAGES_DEAD = [
    'img/snake/die/die 000.png',
    'img/snake/die/die 001.png',
    'img/snake/die/die 002.png',
    'img/snake/die/die 003.png',
  ];

  constructor(startX = 1500, moveRange = 200, id) { // Fügen Sie die id hinzu
    super();
    this.id = id; // Initialisieren Sie die id
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage('img/snake/walk/Walk1.png'); // Stellen Sie sicher, dass dieser Pfad korrekt ist
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE); // Lade Idle-Bilder
    this.loadImages(this.IMAGES_ATTACKING); // Lade Angriffs-Bilder
    this.loadImages(this.IMAGES_DEAD); // Lade Dead-Bilder
    this.speed = 0.02 + Math.random() * 0.05; // Geschwindigkeit reduziert
    this.animate();
  }

  animate() {
    this.movementInterval = setInterval(() => {
      if (this.direction === 'right') {
        this.moveRight(); // Bewege die Schlange nach rechts
      } else {
        this.moveLeft(); 
      }
    }, 1000 / 60); 
  
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING); // Bild wechseln während der Bewegung
      }
    }, 100); 
   
  }
  
  update() {
    this.x += this.speedX; // Bewege die Schlange basierend auf der Geschwindigkeit
  }
  
  



 
 

}
