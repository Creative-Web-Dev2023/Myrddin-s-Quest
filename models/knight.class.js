class Knight extends MovableObject {
    height = 270;
    width = 500;
    y = 240; // Die Höhe des Ritter
    isMoving = false; // Neue Variable, um die Bewegung zu steuern
    isAttacking = false; // Neue Variable, um den Angriff zu steuern
    delay = 3000; // Wartezeit von 3 Sekunden
    direction = 'left'; // Neue Variable, um die Bewegungsrichtung zu steuern

    offset = {
        top: 80,    // Reduziert das Rechteck von oben
        bottom: 80, // Reduziert das Rechteck von unten
        left: 200,   // Reduziert das Rechteck von links
        right: 200  // Reduziert das Rechteck von rechts
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

    constructor(delay=0, startX =800) { // Verzögerung von 0 Sekunden
        super();
        this.x = startX; // Setzt die individuelle Startposition
        this.loadImage('img/knight/walk/walk_0.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACKING);
        this.speed = 0.05 + Math.random() * 0.4; // Reduziere die Geschwindigkeit

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
        this.otherDirection = true; // Drehe das Gesicht nach links
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false; // Drehe das Gesicht nach rechts
    }

    checkCollisionWithCharacter(character) {
        if (this.isAttacking && this.isCollidingWith(character)) {
            character.getHurt();
        }
    }

    isCollidingWith(character) {
        return this.x < character.x + character.width &&
               this.x + this.width > character.x &&
               this.y < character.y + character.height &&
               this.y + this.height > character.y;
    }

    animate() {
        setInterval(() => {
            if (this.isMoving && !this.isAttacking) {
                if (this.direction === 'left') { // Bewege nach links
                    this.moveLeft();
                } else {
                    this.moveRight();
                }
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isMoving && !this.isAttacking) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 5); // Ändere das Bild alle 200 Millisekunden

        // Ändere die Bewegungsrichtung in kürzeren Abständen
        setInterval(() => {
            this.direction = this.direction === 'left' ? 'right' : 'left'; 
            // bedeutet wenn die Richtung links ist, ändere sie in rechts, sonst ändere sie in links
        }, 4000); // Ändere die Richtung alle 4 Sekunden
    }
}

// Function to find the nearest knight to the character
function findNearestKnight(knights, character) {
    let nearestKnight = null; // Initialize the nearest knight to null
    let minDistance = Infinity; // Initialize the minimum distance to infinity

    knights.forEach(knight => { // Loop through all knights
        const distance = Math.abs(knight.x - character.x); // Calculate the distance between the knight and the character
        if (distance < minDistance) { 
            minDistance = distance; // Update the minimum distance
            nearestKnight = knight; // Update the nearest knight
        }
    });

    return nearestKnight;
}

// Example of creating knight instances and checking for collisions
const knights = [new Knight(), new Knight(0, 1000), new Knight(0, 2000)];
const character = new Character(); // Assuming you have a Character class

setInterval(() => {
    const nearestKnight = findNearestKnight(knights, character);
    if (nearestKnight) {
        nearestKnight.checkCollisionWithCharacter(character);
    }
}, 1000 / 40); // Check for collisions 60 times per second


