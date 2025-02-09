class Snake extends Enemy {
  constructor(startX = 400, moveRange = 100, id) {
    super(id);
    this.x = startX;
    this.startX = startX;
    this.moveRange = moveRange;
    this.width = 250;
    this.height = 150;
    this.y = 320;
    this.energy = 10;
    this.dead = false;
    this.attackDamage = 10;
    this.attackRange = 50;
    this.speed = 0.5;
    this.otherDirection = true;
    this.offset = { top: 60, bottom: 60, left: 50, right: 50 };
    this.IMAGES_WALKING = [
      "img/snake/walk/walk0.png",
      "img/snake/walk/walk1.png",
      "img/snake/walk/walk2.png",
      "img/snake/walk/walk3.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/snake/attack/attack0.png",
      "img/snake/attack/attack1.png",
      "img/snake/attack/attack2.png",
      "img/snake/attack/attack3.png",
    ];
    this.IMAGES_HURT = [
      "img/snake/hurt/hurt0.png",
      "img/snake/hurt/hurt1.png",
    ];
    this.IMAGES_DEAD = [
      "img/snake/die/die0.png",
      "img/snake/die/die1.png",
      "img/snake/die/die2.png",
      "img/snake/die/die3.png",
    ];

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  setWorld(world) {
    this.world = world;
  }

    /** 🔹 Prüfen, ob Charakter in Angriffsreichweite ist */
    checkForAttack(character) {
        const snakeBox = this.getCollisionBox();
        const characterBox = character.getCollisionBox();
        const attackBox = {
            x: this.otherDirection ? snakeBox.x - this.attackRange : snakeBox.x + snakeBox.width,
            y: snakeBox.y,
            width: this.attackRange * 2,
            height: snakeBox.height,
        };
        const isInAttackRange =
            attackBox.x < characterBox.x + characterBox.width &&
            attackBox.x + attackBox.width > characterBox.x &&
            attackBox.y < characterBox.y + characterBox.height &&
            attackBox.y + attackBox.height > characterBox.y;

        if (isInAttackRange && !this.isAttacking) {
            this.attack(character);
        }
    }

    /** 🔹 Angriff ausführen */
    attack(character) {
        if (this.dead || this.isAttacking) return;
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_ATTACKING);
        setTimeout(() => {
            if (this.isInAttackRange(character)) {
                character.takeDamage(this.attackDamage);
            }
            this.isAttacking = false;
        }, 500);
    }

    /** 🔹 Bewegung */
    patrol() {
        if (this.dead) return;
        this.x += this.otherDirection ? -this.speed : this.speed;
    }

    /** 🔹 Snake aktualisieren */
    update(character) {
        this.checkForAttack(character);
    }

    /** 🔹 Schaden nehmen */
    takeDamage(damage) {
        if (this.dead) return;
        this.energy -= damage;
        this.energy = Math.max(0, this.energy);

        if (this.energy > 0) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.die();
        }
    }

    /** 🔹 Stirbt und spielt die Death-Animation */
    die() {
        if (this.dead) return;
        this.dead = true;
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => this.remove(), 1000);
    }

    /** 🔹 Entfernen */
    remove() {
        this.removeEnemy();
    }

    loadImages(imageArray) {
        imageArray.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    animate() {
        setInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);
            }
        }, 100);
    }
}
