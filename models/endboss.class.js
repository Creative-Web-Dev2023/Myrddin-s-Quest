// Import the Enemy class
class Endboss extends Enemy {
  constructor(id) {
    super(id); // ID an den Konstruktor der Basisklasse übergeben
    this.height = 600;
    this.width = 450;
    this.y = -100;
    this.x = 3500;
    this.attackRange = 200; // Setzt die Reichweite für den Angriff
    this.attackDamage = 20; // Schaden, den der Endboss verursacht
    this.speed = 5;
    this.deadSound = new Audio("audio/troll dead.mp3");
    this.offset = { top: 180, bottom: 65, left: 90, right: 90 };
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
    const bossBox = this.getCollisionBox();
    const characterBox = character.getCollisionBox();
    const attackBox = {
      x: bossBox.x + bossBox.width,
      y: bossBox.y,
      width: this.attackRange,
      height: bossBox.height,
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
      const bossBox = this.getCollisionBox();
      const isStillInRange =
        bossBox.x < characterBox.x + characterBox.width &&
        bossBox.x + bossBox.width > characterBox.x &&
        bossBox.y < characterBox.y + characterBox.height &&
        bossBox.y + bossBox.height > characterBox.y;
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
  }

  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.deathAnimationPlayed = true;
      this.dead = true;
      // console.log('Todesanimation abspielen');
      this.playAnimation(this.IMAGES_DEAD);
      setTimeout(() => {
        if (this.world) {
          this.remove(); // Verwenden Sie die eigene remove-Methode
        } else {
          // console.log('Welt nicht definiert');
        }
      }, 3000);
    }
  }

  remove() {
    if (this.world && this.world.enemies) {
      const bossIndex = this.world.enemies.findIndex((boss) => boss.id === this.id);
      if (bossIndex !== -1) {
        this.world.enemies.splice(bossIndex, 1);
        // console.log('Endboss entfernt');
      } else {
        // console.log('Endboss nicht gefunden');
      }
    } else {
      // console.log('Welt oder Feinde nicht definiert');
    }
  }
}
