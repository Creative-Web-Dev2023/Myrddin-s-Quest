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
  health = 100; // Lebenspunkte des Knights
  projectiles = [];

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
  IMAGES_DEAD = [
    'img/knight/death/death 0.png',
    'img/knight/death/death 1.png',
    'img/knight/death/death 2.png',
    'img/knight/death/death 3.png',
    'img/knight/death/death 4.png',
    'img/knight/death/death 5.png',
  ];
  IMAGES_HURT = [
    'img/knight/hurt/hurt 0.png',
    'img/knight/hurt/hurt 1.png',
  ];
 
  constructor(delay = 0, startX = 800, moveRange = 100) {
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.loadImage('img/knight/walk/walk 0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    
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

    this.fireballInterval = setInterval(() => {
      this.checkForFireball();
    }, 1000 / 2); // Überprüfe alle 0.5 Sekunden

    this.projectileInterval = setInterval(() => {
      this.updateProjectiles();
    }, 1000 / 30); // Aktualisiere die Projektile alle 0.03 Sekunden
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
      // Spiele die Todesanimation
      this.playAnimationOnce(this.IMAGES_DEAD);
    } else if (this.isAttacking) {
      // Spiele die Angriffsanimation
      this.playAnimation(this.IMAGES_ATTACKING);
    } else if (this.isMoving) {
      // Spiele die Laufanimation
      this.playAnimation(this.IMAGES_WALKING);
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

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    } else {
      this.playAnimationOnce(this.IMAGES_HURT); // Spiele die Hurt-Animation
    }
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
      }, 3000); // Bleibe 3 Sekunden auf dem Boden, bevor du verschwindest
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

  checkForFireball() {
    if (this.world && this.world.character) {
      const distance = Math.abs(this.x - this.world.character.x);
      if (distance < 400 && !this.isAttacking) { // Wenn der Charakter in Reichweite ist
        this.shootFireball();
      }
    }
  }
  

  shootFireball() {
    console.log('fireball geschossen');
    this.isAttacking = true; // Setzt den Zustand auf "greift an"
    const fireballX = this.otherDirection ? this.x - 20 : this.x + this.width - 20; // Position anpassen
    const fireballY = this.y + this.height / 2; // Position anpassen
    const fireball = new Comet(fireballX, fireballY, this.otherDirection); // Projektil erstellen
    console.log('Position des Fireballs:', fireball.x, fireball.y);
    if (this.world) {
      this.world.addProjectile(fireball); // Projektil zur Welt hinzufügen
    }
    setTimeout(() => {
      this.isAttacking = false; // Zustand zurücksetzen
    }, 500); // Nach 0,5 Sekunden wieder bereit
  }
  
  

  updateProjectiles() {
    this.projectiles.forEach((projectile, index) => {
      projectile.moveLeft();
      if (projectile.isOutOfScreen()) {
        this.projectiles.splice(index, 1); // Projektil entfernen, wenn es aus dem Bildschirm ist
      }
    });
  }
  
}

class Comet extends MovableObject {
  constructor(x, y, otherDirection) {
    super();
    this.x = x;
    this.y = y; // Position anpassen, damit der Comet aus der Hand startet
    this.width = 40;
    this.height = 20;
    this.otherDirection = otherDirection;
    this.loadImages([
      'img/knight/comet/comet_0.png',
      'img/knight/comet/comet_1.png',
      'img/knight/comet/comet_2.png',
      'img/knight/comet/comet_3.png',
      'img/knight/comet/comet_4.png',
      'img/knight/comet/comet_5.png',
      'img/knight/comet/comet_6.png',
      'img/knight/comet/comet_7.png',
      'img/knight/comet/comet_8.png',
      'img/knight/comet/comet_9.png',
      'img/knight/comet/comet_10.png',
      'img/knight/comet/comet_11.png',
      'img/knight/comet/comet_12.png',
      'img/knight/comet/comet_13.png',
    ]);
    this.speed = 10; // Geschwindigkeit des Comets
    this.currentImage = 0;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.images);
    }, 1000 / 10); // Animation mit 10 FPS
  }

  moveLeft() {
    if (this.otherDirection) {
      this.x -= this.speed; // Nach links bewegen
    } else {
      this.x += this.speed; // Nach rechts bewegen
    }
  }

  isOutOfScreen() {
    return this.x < 0 || this.x > this.world.canvasWidth; // Bildschirmgrenzen überprüfen
  }
}
