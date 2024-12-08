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

  offset = {
    top: 70, // Verkleinere die oberen Offset-Werte
    bottom: 30, // Verlängere die unteren Offset-Werte
    left: 20, // Verkleinere die linken Offset-Werte
    right: 180 // Verkleinere die rechten Offset-Werte
  };

  IMAGES_WALKING = [
    'img/Boss2/walk/walk 0.png',
    'img/Boss2/walk/walk 1.png',
    'img/Boss2/walk/walk 2.png',
    'img/Boss2/walk/walk 3.png',
    'img/Boss2/walk/walk 4.png',
    'img/Boss2/walk/walk 5.png',
  ];

  IMAGES_DEAD = [
    'img/Boss2/death/death 0.png',
    'img/Boss2/death/death 1.png',
    'img/Boss2/death/death 2.png',
    'img/Boss2/death/death 3.png',
    'img/Boss2/death/death 4.png',
    'img/Boss2/death/death 5.png',
  ];
  IMAGES_HURT = [
    'img/Boss2/hurt/hurt 0.png',
    'img/Boss2/hurt/hurt 1.png',
  ];
  IMAGES_FIREBALL = [
    'img/Boss2/magic-fire/magic_fire 0.png',
    'img/Boss2/magic-fire/magic_fire 1.png',
    'img/Boss2/magic-fire/magic_fire 2.png',
    'img/Boss2/magic-fire/magic_fire 3.png',
    'img/Boss2/magic-fire/magic_fire 4.png',
  ];

  constructor(delay = 0, startX = 800, moveRange = 100) {
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage('img/Boss2/walk/walk 0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_FIREBALL);
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
    if (!this.dead) {
      if (this.isMoving) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    } else if (this.currentImage < this.IMAGES_DEAD.length) {
      this.playAnimationOnce(this.IMAGES_DEAD);
    }
  }
  playAnimationOnce(images) {
    if (this.currentImage < images.length) {
      this.img = this.imageCache[images[this.currentImage]];
      this.currentImage++;
    } else {
      this.currentImage = 0; // Animation zurücksetzen
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
    this.playAnimationOnce(this.IMAGES_HURT); // Spiele die Hurt-Animation
    setTimeout(() => {
      this.playAnimationOnce(this.IMAGES_DEAD); // Spiele die Dead-Animation nach der Hurt-Animation
      setTimeout(() => {
        this.disappear();
      }, 2000); // Bleibe 2 Sekunden auf dem Boden, bevor du verschwindest
    }, 1000); // Warte 1 Sekunde, bevor die Dead-Animation abgespielt wird
  }

  disappear() {
    if (this.world && this.world.enemies) {
      const index = this.world.enemies.indexOf(this);
      if (index > -1) {
        this.world.enemies.splice(index, 1);
      }
    }
  }
}
