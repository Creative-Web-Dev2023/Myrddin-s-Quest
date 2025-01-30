class Endboss extends Enemy {
  constructor(id) {
    super(id);
    this.height = 450; // Größere Höhe
    this.width = 360; // Größere Breite
    this.y = 50; 
    this.x = 13000; 
    this.attackRange = 200; 
    this.attackDamage = 20; 
    this.speed = 5;
    this.deadSound = new Audio("audio/troll dead.mp3");
    this.offset = { top: 50, bottom: 20, left: 20, right: 20 };
    this.statusBarEndboss = new EndbossStatusbar(); 
    this.otherDirection = true; 
    this.energy = 100; // Setze die Lebenspunkte des Endbosses auf 100
    this.statusBarEndboss.setPercentage(this.energy); // Statusleiste initialisieren
    this.IMAGES_WALKING = [
      "img/troll/idle/idle_000.png",
      "img/troll/idle/idle_001.png",
      "img/troll/idle/idle_002.png",
      "img/troll/idle/idle_003.png",
      "img/troll/idle/idle_004.png",
      "img/troll/idle/idle_005.png",
      "img/troll/idle/idle_006.png",
      "img/troll/idle/idle_007.png",
      "img/troll/idle/idle_008.png",
      "img/troll/idle/idle_009.png",
    ];
    this.IMAGES_ATTACKING = [
      "img/troll/attack/attack_000.png",
      "img/troll/attack/attack_001.png",
      "img/troll/attack/attack_002.png",
      "img/troll/attack/attack_003.png",
      "img/troll/attack/attack_004.png",
      "img/troll/attack/attack_005.png",
      "img/troll/attack/attack_006.png",
      "img/troll/attack/attack_007.png",
      "img/troll/attack/attack_008.png",
      "img/troll/attack/attack_009.png",
    ];
    this.IMAGES_HURT = [
      "img/troll/hurt/hurt_000.png",
      "img/troll/hurt/hurt_001.png",
      "img/troll/hurt/hurt_002.png",
      "img/troll/hurt/hurt_003.png",
      "img/troll/hurt/hurt_004.png",
      "img/troll/hurt/hurt_005.png",
      "img/troll/hurt/hurt_006.png",
      "img/troll/hurt/hurt_007.png",
      "img/troll/hurt/hurt_008.png",
      "img/troll/hurt/hurt_009.png",
    ];
    this.IMAGES_DEAD = [
      "img/troll/die/die_000.png",
      "img/troll/die/die_001.png",
      "img/troll/die/die_002.png",
      "img/troll/die/die_003.png",
      "img/troll/die/die_004.png",
      "img/troll/die/die_005.png",
      "img/troll/die/die_006.png",
      "img/troll/die/die_007.png",
      "img/troll/die/die_008.png",
      "img/troll/die/die_009.png",
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

  playDeadSound() {
    this.deadSound.play();
  }

  checkForAttack(character) {
    const endbossBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: endbossBox.x - this.attackRange,
      y: endbossBox.y,
      width: this.attackRange * 2,
      height: endbossBox.height,
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
  takeDamage(damage) {
    if (!this.dead) {
        this.energy = Math.max(this.energy - damage, 0);
        this.statusBarEndboss.setPercentage(Math.floor(this.energy / 20) * 20);
        console.log("Endboss Health:", this.energy);
        if (this.energy <= 0) {
            this.die();
        }
    }
}

  die() {
    if (!this.isDead()) {
        this.dead = true;
        this.playAnimation(this.IMAGES_DEAD);
        this.playDeadSound();
    }
  }

  update(character) {
    this.checkForAttack(character);
    this.statusBarEndboss.setPercentage(this.energy); 
  }

  draw(ctx) {
    if (this.img && this.img.complete) {
        if (this.otherDirection) {
            ctx.save();
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        this.statusBarEndboss.x = this.x + this.width / 2 - this.statusBarEndboss.width / 2; 
        this.statusBarEndboss.y = this.y - this.statusBarEndboss.height + 20; 
        this.statusBarEndboss.setPercentage(this.energy);
        this.statusBarEndboss.draw(ctx);
    }
  }
    updateEndbossHealth(damage) {
    if (this.world.endboss) {
      this.world.endboss.takeDamage(damage);
    }
  }
}