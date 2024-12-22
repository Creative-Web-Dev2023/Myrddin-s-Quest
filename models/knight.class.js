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
    this.otherDirection = true; // Ensure the knight faces left by default
    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);
    this.playAnimation(this.IMAGES_WALKING); // Start with walking animation
  }
  
  setWorld(world) {
    this.world = world;
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
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isAttacking) {
      // Spiele die Angriffsanimation
      this.playAnimation(this.IMAGES_ATTACKING);
    } else if (this.isMoving) {
      // Spiele die Laufanimation
      this.playAnimation(this.IMAGES_WALKING);
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
    this.playAnimation(this.IMAGES_DEAD); // Spiele die Dead-Animation
    setTimeout(() => {
      this.disappear();
    }, 3000); // Bleibe 3 Sekunden auf dem Boden, bevor du verschwindest
  }

  disappear() {
    if (this.world && this.world.enemies) {
      const index = this.world.enemies.indexOf(this);
      if (index > -1) {
        this.world.enemies.splice(index, 1);
      }
    }
  }

  checkForTeslaBall() {
    if (this.world && this.world.character) {
      const distance = Math.abs(this.x - this.world.character.x);
      if (distance < 300 && !this.isAttacking) { // Wenn der Charakter in Reichweite ist
        this.shootTeslaBall();
      }
    }
  }

  shootTeslaBall() {
    this.isAttacking = true; // Setzt den Zustand auf "greift an"
    const teslaBallX = this.otherDirection ? this.x - 20 : this.x + this.width - 20; // Position anpassen
    const teslaBallY = this.y + this.height / 2 - 10; // Position anpassen, damit der TeslaBall aus der Hand startet
    const teslaBall = new TeslaBall(teslaBallX, teslaBallY, this.otherDirection, this.world); // Projektil erstellen
    console.log('Position des TeslaBalls:', teslaBall.x, teslaBall.y);
    if (this.world) {
      this.world.addTeslaBall(teslaBall); // Projektil zur Welt hinzufügen
    }
    setTimeout(() => {
      this.isAttacking = false; // Zustand zurücksetzen
    }, 500); // Nach 0,5 Sekunden wieder bereit
  }

}

class TeslaBall extends MovableObject {
  constructor(x, y, otherDirection, world) {
    super();
    this.x = x;
    this.y = y; // Position anpassen, damit der TeslaBall aus der Hand startet
    this.width = 40;
    this.height = 20;
    this.otherDirection = otherDirection;
    this.world = world; // Store the world reference
    this.loadImages([
      'img/obstacles/tesla_ball/tesla_ball1.png',
      'img/obstacles/tesla_ball/tesla_ball2.png',
      'img/obstacles/tesla_ball/tesla_ball3.png',
      'img/obstacles/tesla_ball/tesla_ball4.png',
      'img/obstacles/tesla_ball/tesla_ball5.png',
      'img/obstacles/tesla_ball/tesla_ball6.png',
      'img/obstacles/tesla_ball/tesla_ball7.png',
      'img/obstacles/tesla_ball/tesla_ball8.png',
      'img/obstacles/tesla_ball/tesla_ball9.png',
      'img/obstacles/tesla_ball/tesla_ball10.png',
      'img/obstacles/tesla_ball/tesla_ball11.png',
      'img/obstacles/tesla_ball/tesla_ball12.png',
      'img/obstacles/tesla_ball/tesla_ball13.png',
      'img/obstacles/tesla_ball/tesla_ball14.png',
      'img/obstacles/tesla_ball/tesla_ball15.png',
      'img/obstacles/tesla_ball/tesla_ball16.png',
      'img/obstacles/tesla_ball/tesla_ball17.png',
    ]);
    this.speed = 10; // Geschwindigkeit des TeslaBalls
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

  draw(ctx) {
    this.moveLeft(); // Ensure the TeslaBall moves
    super.draw(ctx); // Call the draw method from DrawableObject
  }

  isOutOfScreen() {
    return this.x < 0 || this.x > this.world.canvas.width; // Bildschirmgrenzen überprüfen
  }
}

