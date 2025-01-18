class Endboss extends Enemy {
  constructor(id) {
    super(id); // ID an den Konstruktor der Basisklasse übergeben
    this.height = 600;
    this.width = 450;
    this.y = -70;
    this.x = 13000; // Passen Sie die Position des Endbosses an
    this.attackRange = 200; // Setzt die Reichweite für den Angriff
    this.attackDamage = 20; // Schaden, den der Endboss verursacht
    this.speed = 5;
    this.deadSound = new Audio("audio/troll dead.mp3");
    this.offset = { top: 180, bottom: 65, left: 90, right: 90 };
    this.statusBarEndboss = new EndbossStatusbar(); // Initialisiere die Statusleiste des Endbosses
    this.otherDirection = true; // Endboss schaut nach links
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

  attack(character) {
    if (this.dead || this.isAttacking) return;
    this.isAttacking = true;
    this.playAnimation(this.IMAGES_ATTACKING);
    setTimeout(() => {
      const characterBox = character.getCollisionBox();
      const endbossBox = this.getCollisionBox();
      const isStillInRange =
        endbossBox.x < characterBox.x + characterBox.width &&
        endbossBox.x + endbossBox.width > characterBox.x &&
        endbossBox.y < characterBox.y + characterBox.height &&
        endbossBox.y + endbossBox.height > characterBox.y;
      if (isStillInRange) {
        character.takeDamage(this.attackDamage);
      }
      setTimeout(() => {
        this.isAttacking = false;
      }, 500);
    }, 400);
  }

  update(character) {
    this.checkForAttack(character);
    this.statusBarEndboss.setPercentage(this.energy); // Aktualisiere die Statusleiste basierend auf der Energie des Endbosses
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
      this.statusBarEndboss.y = this.y - this.statusBarEndboss.height - 10; // Position über dem Kopf des Endbosses
      this.statusBarEndboss.draw(ctx);
    }
  }
}