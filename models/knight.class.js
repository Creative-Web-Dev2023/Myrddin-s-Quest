class Knight extends MovableObject {
  height = 270;
  width = 500;
  y = 240;
  isMoving = false;
  isAttacking = false;
  delay = 3000;
  direction = 'left';
  moveRange = 100; // Standardbewegungsbereich
  startX = 800; // Startposition
  energy = 100; // Energie des Ritters
  attackCooldown = false;

  offset = {
    top: 80,
    bottom: 80,
    left: 200,
    right: 200
  };

  IMAGES_WALKING = [
    'img/knight/walk/walk_0.png',
    'img/knight/walk/walk_1.png',
    'img/knight/walk/walk_2.png',
    'img/knight/walk/walk_3.png',
    'img/knight/walk/walk_4.png',
    'img/knight/walk/walk_5.png',
  ];

  IMAGES_ATTACKING = [
    'img/knight/attack/attack 000.png',
    'img/knight/attack/attack 001.png',
    'img/knight/attack/attack 002.png',
    'img/knight/attack/attack 003.png',
  ];

  IMAGES_DEAD = [
    'img/knight/die/death 000.png',
     'img/knight/die/death 001.png',
     'img/knight/die/death 002.png',
     'img/knight/die/death 003.png',
  ];

  IMAGES_HURT = [
    'img/knight/hurt/hurt 000.png',
    'img/knight/hurt/hurt 001.png',
  ];

  constructor(delay = 0, startX = 800, moveRange = 100) {
    super();
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.otherDirection = false;  // Hier hinzufügen
    this.loadImage('img/knight/walk/walk_0.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.speed = 0.01 + Math.random() * 0.05; // Geschwindigkeit reduziert
    this.healthBar = new KnightStatusbar(); 
    this.healthBar.setPercentage(this.energy);

    setTimeout(() => {
      this.isMoving = true;
      this.animate();
    }, delay);

    this.addKeyboardListeners();
  }

  addKeyboardListeners() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'f' || event.key === 'F') {
        this.startAttacking();
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === 'f' || event.key === 'F') {
        this.stopAttacking();
      }
    });
  }

  startMovement() {
    this.isMoving = true;
    this.animate();
  }

  startAttacking() {
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
  }

  stopAttacking() {
    this.isAttacking = false;
    this.playAnimation(this.IMAGES_WALKING);
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  checkCollisionWithCharacter(character) {
    if (this.isAttacking && this.isCollidingWith(character)) {
      character.getHurt();
    }
  }

  animate() {
    setInterval(() => {
      if (this.isMoving && !this.isAttacking) { // Use this.isDead() as a function
        if (this.direction === 'left') {
          this.moveLeft();
          if (this.x <= this.startX - this.moveRange) {
            this.direction = 'right';
            this.otherDirection = false; // Richtungswechsel
          }
        } else {
          this.moveRight();
          if (this.x >= this.startX + this.moveRange) {
            this.direction = 'left';
            this.otherDirection = true; // Richtungswechsel
          }
        }
      }
    }, 1000 / 30);

    setInterval(() => {
      if (this.isMoving && !this.isAttacking) { // Use this.isDead() as a function
        this.playAnimation(this.IMAGES_WALKING); 
      }
    }, 1000 / 8); // Reduzieren Sie die Häufigkeit der Animationen

    // Häufiger Richtungswechsel
    setInterval(() => {
      this.direction = this.direction === 'left' ? 'right' : 'left';
      this.otherDirection = !this.otherDirection;
    }, 3000); // Erhöhen Sie das Intervall für den Richtungswechsel
  }
 
  
  isDead() {
    return this.energy <= 0;

  }

  attackCharacter(character) {
    if (this.attackCooldown || this.isDead()) return;
  
    // Prüfe, ob der Charakter in Reichweite ist (z. B. 100 Pixel)
    const distance = Math.abs(this.x - character.x);
    if (distance <= 100) {
      character.hit(this); // Rufe die `hit()`-Methode des Charakters auf
    }
  
    this.attackCooldown = true;
    setTimeout(() => {
      this.attackCooldown = false;
    }, 1500); // 1,5 Sekunden Abklingzeit
  }
  

  update() {
    this.healthBar.x = this.x + this.width / 2 - this.healthBar.width / 2;
    this.healthBar.y = this.y - this.healthBar.height - 15; // Abstand von oben anpassen
    this.healthBar.setPercentage(this.energy); // Aktualisiere die Energie der Statusleiste
  }

  draw(ctx) {
    super.draw(ctx);
    this.healthBar.draw(ctx); // Zeichne die Statusleiste des Ritters
  }
}

function findNearestKnight(knights, mainCharacter) {
  let nearestKnight = null;
  let minDistance = Infinity;

  knights.forEach(knight => {
    const distance = Math.abs(knight.x - mainCharacter.x);
    if (distance < minDistance) { 
      minDistance = distance;
      nearestKnight = knight;
    }
  });

  return nearestKnight;
}

const knights = [new Knight(), new Knight(0, 1000), new Knight(0, 2000)];
const character = new Character();

setInterval(() => {
  const nearestKnight = findNearestKnight(knights, character);
  if (nearestKnight) {
    nearestKnight.checkCollisionWithCharacter(character);
  }
}, 1000 / 40);