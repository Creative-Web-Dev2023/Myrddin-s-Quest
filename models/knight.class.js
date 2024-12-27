class Knight extends MovableObject {
  height = 270;
  width = 400;
  y = 200; // Erhöhe die Y-Position, damit der Ritter höher positioniert wird
  delay = 3000;
  direction = 'left';
  moveRange = 100; // Bewegungsbereich
  startX = 800; // Startposition
  isMoving = false;
  isAttacking = false;
  dead = false; // Zustand für tot
 
  healthBar; // Statusleiste für das Leben des Ritters

  offset = {
    top: 70, // Verkleinere die oberen Offset-Werte
    bottom: 30, // Verlängere die unteren Offset-Werte
    left: 20, // Verkleinere die linken Offset-Werte
    right: 180 // Verkleinere die rechten Offset-Werte
  };

  IMAGES_WALKING = [
    'img/knight/walk/walk 0.png',
    'img/knight/walk/walk 1.png',
    'img/knight/walk/walk 2.png',
    'img/knight/walk/walk 3.png',
    'img/knight/walk/walk 4.png',
    'img/knight/walk/walk 5.png',
  ];
  IMAGES_ATTACKING = [
    'img/knight/attack/attack 0.png',
    'img/knight/attack/attack 1.png',
    'img/knight/attack/attack 2.png',
    'img/knight/attack/attack 3.png',
    'img/knight/attack/attack 4.png',
    'img/knight/attack/attack 5.png',
    'img/knight/attack/attack 6.png',
  ];
  IMAGES_HURT = [
    'img/knight/hurt/hurt 0.png',
    'img/knight/hurt/hurt 1.png',
  ];
  IMAGES_DEAD = [
    'img/knight/death/death 0.png',
    'img/knight/death/death 1.png',
    'img/knight/death/death 2.png',
    'img/knight/death/death 3.png',
    'img/knight/death/death 4.png',
    'img/knight/death/death 5.png',
  ];

  constructor(delay = 0, startX = 800, moveRange = 100) {
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage('img/knight/walk/walk 0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    
    this.speed = 0.01 + Math.random() * 0.05; // Geschwindigkeit reduziert
    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);
  }

  loadImages(images) {
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  setWorld(world) {
    this.world = world;
  }

  animate() {
    this.movementInterval = setInterval(() => {
      this.handleMovement();
    }, 1000 / 30);

    this.animationInterval = setInterval(() => {
      this.handleAnimation();
    }, 1000 / 6);

    this.attackAnimationInterval = setInterval(() => {
      if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACKING);
      }
    }, 1000 / 7); // Verlangsamen Sie die Angriffsanimation
  }

  handleMovement() {
    if (!this.dead && this.isMoving) {
      this.moveLeft(); // Immer nach links laufen
      this.otherDirection = true; // Bild spiegeln
      if (this.x <= this.startX - this.moveRange) {
        this.x = this.startX; // Zurück zur Startposition, wenn das Ende des Bewegungsbereichs erreicht ist
      }
    }
  }

  handleAnimation() {
    if (this.dead) {
      this.playAnimation(this.IMAGES_DEAD, 200); // Verlangsamen Sie die Dead-Animation
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACKING, 100); // Verlangsamen Sie die Angriffsanimation
    } else if (this.isMoving) {
      this.playAnimation(this.IMAGES_WALKING, 100); // Verlangsamen Sie die Laufanimation
    }
  }

  getCollisionBox() {
    return {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };
  }

  die() {
    this.dead = true;
    this.isMoving = false; // Stoppe Bewegungen
    this.speed = 0; // Keine Geschwindigkeit mehr
    this.currentImage = 0; // Reset animation frame
    this.playAnimation(this.IMAGES_HURT, 200); // Spiele die Hurt-Animation langsamer
    setTimeout(() => {
      this.playAnimation(this.IMAGES_DEAD, 200); // Spiele die Dead-Animation langsamer
    }, 1000); // Warte 1 Sekunde, bevor die Dead-Animation abgespielt wird
  }

  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
    if (this.energy == 0) {
      this.die();
    }
  }

  draw(ctx) {
    super.draw(ctx); // Zeichne den Ritter
  }

}