class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 150; // Stellen Sie sicher, dass dies eine angemessene Höhe ist
  speed = 5;
  coins = 0;
  coinStatusBar;
  invulnerable = false;
  poisonCollected = 0; // Gift gesammelt
  attackCooldown = false;

  offset = {
    top: 50, // Reduziert das Rechteck von oben
    bottom: 10, // Reduziert das Rechteck von unten
    left: 200, // Reduziert das Rechteck von links
    right: 200, // Reduziert das Rechteck von rechts
  };

  IMAGES_IDLE = [
    "img/wizard/idle/idle_000.png",
    "img/wizard/idle/idle_001.png",
    "img/wizard/idle/idle_002.png",
    "img/wizard/idle/idle_003.png",
    "img/wizard/idle/idle_004.png",
    "img/wizard/idle/idle_005.png",
    "img/wizard/idle/idle_006.png",
    "img/wizard/idle/idle_007.png",
    "img/wizard/idle/idle_008.png",
    "img/wizard/idle/idle_009.png",
  ];

  IMAGES_WALKING = [
    "img/wizard/walk/walk_001.png",
    "img/wizard/walk/walk_002.png",
    "img/wizard/walk/walk_003.png",
    "img/wizard/walk/walk_004.png",
    "img/wizard/walk/walk_005.png",
    "img/wizard/walk/walk_006.png",
    "img/wizard/walk/walk_007.png",
    "img/wizard/walk/walk_008.png",
    "img/wizard/walk/walk_009.png",
  ];

  IMAGES_JUMPING = [
    "img/wizard/jump/jump_000.png",
    "img/wizard/jump/jump_001.png",
    "img/wizard/jump/jump_002.png",
    "img/wizard/jump/jump_003.png",
    "img/wizard/jump/jump_004.png",
    "img/wizard/jump/jump_005.png",
    "img/wizard/jump/jump_006.png",
    "img/wizard/jump/jump_007.png",
    "img/wizard/jump/jump_008.png",
    "img/wizard/jump/jump_009.png",
  ];
  IMAGES_ATTACK = [
    "img/wizard/attack/Attack1.png",
    "img/wizard/attack/Attack2.png",
    "img/wizard/attack/Attack3.png",
    "img/wizard/attack/Attack4.png",
    "img/wizard/attack/Attack5.png",
    "img/wizard/attack/Attack6.png",
    "img/wizard/attack/Attack7.png",
  ];
  IMAGES_DEAD = [
    "img/wizard/die/die_000.png",
    "img/wizard/die/die_001.png",
    "img/wizard/die/die_002.png",
    "img/wizard/die/die_003.png",
    "img/wizard/die/die_004.png",
    "img/wizard/die/die_005.png",
    "img/wizard/die/die_006.png",
    "img/wizard/die/die_007.png",
    "img/wizard/die/die_008.png",
    "img/wizard/die/die_009.png",
  ];

  IMAGES_HURT = [
    "img/wizard/hurt/hurt_000.png",
    "img/wizard/hurt/hurt_001.png",
    "img/wizard/hurt/hurt_002.png",
    "img/wizard/hurt/hurt_003.png",
    "img/wizard/hurt/hurt_004.png",
    "img/wizard/hurt/hurt_005.png",
    "img/wizard/hurt/hurt_006.png",
    "img/wizard/hurt/hurt_007.png",
    "img/wizard/hurt/hurt_008.png",
    "img/wizard/hurt/hurt_009.png",
  ];
  IMAGES_FIRE_ATTACK = [
    "img/wizard/fire/fire1.png",
    "img/wizard/fire/fire2.png",
    "img/wizard/fire/fire3.png",
    "img/wizard/fire/fire4.png",
    "img/wizard/fire/fire5.png",
    "img/wizard/fire/fire6.png",
    "img/wizard/fire/fire7.png",
    "img/wizard/fire/fire8.png",
    "img/wizard/fire/fire9.png",
    "img/wizard/fire/fire10.png",
  ];

  world = {};
  walking_sound = new Audio("audio/walking.mp3");
  attack_sound = new Audio("audio/wizard_attack.mp3");
  fire_attack_sound = new Audio("audio/fire_attack.mp3");
  collect_coin_sound = new Audio("audio/collect_coins.mp3");

  constructor(world, coinStatusBar, poisonStatusBar) {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_FIRE_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.coinsCollected = 0; // Münzen gesammelt
    this.applyGravity();
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
    this.coinStatusBar = coinStatusBar || new CoinStatusBar(); // Statusleiste für Münzen
    this.coinStatusBar.setPercentage(0); // Initialize coin status bar to 0%
    this.poisonStatusBar = poisonStatusBar || new PoisonStatusbar(); // Statusleiste für Gift
    this.poisonStatusBar.setPercentage(0); // Initialize poison status bar to 0%
    this.healthBar = new Statusbar(); // Füge eine Statusleiste für den Charakter hinzu
    this.healthBar.setPercentage(this.energy); // Setze die Energie der Statusleiste
  }

  throwObject() {
    if (this.world && this.world.throwableObjects) {
      const throwableObject = new ThrowableObject(this.x + this.width / 2, this.y + this.height / 2);
      this.world.throwableObjects.push(throwableObject);
    } else {
      console.error('throwableObjects array is not initialized in the world');
    }
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
          clearInterval(this.animationInterval); // Stop animation only after the death animation is complete
        }
      } else if (this.world.keyboard && this.world.keyboard.THROW) {
        this.playAnimation(this.IMAGES_FIRE_ATTACK);
        if (this.fire_attack_sound.paused) {
          this.fire_attack_sound.play(); // Spiele den Angriffssound ab
        }
      } else if (this.world.keyboard && this.world.keyboard.ATTACK) {
        this.playAnimation(this.IMAGES_ATTACK);
        if (this.attack_sound.paused) {
          this.attack_sound.play();
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  update() {
    if (!this.isDead()) {
      this.walking_sound.pause();
      if (this.world.keyboard && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
        this.moveRight();
        this.otherDirection = false;
        this.walking_sound.play();
      }
      if (this.world.keyboard && this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        this.walking_sound.play();
      }
      if (this.world.keyboard && this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      if (this.world.keyboard && this.world.keyboard.ATTACK) {
        this.attack();
      }
      this.world.camera_x = -this.x - 190;
      this.collectCoins();
      this.collectPoison(); // Überprüfe Kollision mit Giftflaschen
    }
  }

  collectPoison() {
    if (this.world.poisonsArray) {
      this.world.poisonsArray.forEach((poison, index) => {
        if (poison.isActive && this.checkCollision(poison)) {
          poison.deactivate();
          this.poisonCollected += 1; // Erhöhe die gesammelten Giftflaschen
          this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update die Statusleiste
          this.world.poisonsArray.splice(index, 1); // Entferne das Giftobjekt aus dem Array
        }
      });
    }
  }

  collectCoins() {
    if (this.world.coinsArray) {
      this.world.coinsArray.forEach((coin) => {
        if (coin.isActive && this.checkCollision(coin)) {
          coin.deactivate();
          this.coinsCollected++; // Erhöhe die gesammelten Münzen
          this.coinStatusBar.setPercentage(this.coinsCollected); // Statusleiste aktualisieren
          if (this.collect_coin_sound.paused) {
            this.collect_coin_sound.play(); // Spiele den Münzensammelsound ab
          }
        }
      });
    }
  }
  
  jump() {
    this.speedY = 33; // Die Geschwindigkeit des Sprungs
  }

  checkCollision(coin) {
    const characterHitbox = {
      x: this.x + this.offset.left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom
    };
 
    return (
      characterHitbox.x < coin.x + coin.width &&
      characterHitbox.x + characterHitbox.width > coin.x &&
      characterHitbox.y < coin.y + coin.height &&
      characterHitbox.y + characterHitbox.height > coin.y
    );
  }
 
  attack() {
    if (this.world.enemies && Array.isArray(this.world.enemies)) {
      let nearestKnight = null; // Setze den nächsten Ritter auf null
      let minDistance = Infinity; // Setze den Abstand auf unendlich
      this.world.enemies.forEach((enemy) => {
        if (enemy instanceof Knight) { // Prüfen, ob der Feind ein Ritter ist
          const distance = Math.abs(this.x - enemy.x); // Berechne den Abstand zwischen Charakter und Feind
          if (distance < minDistance) { // Wenn der Abstand kleiner als der bisherige kleinste Abstand ist
            minDistance = distance; // Setze den Abstand auf den neuen kleinsten Abstand
            nearestKnight = enemy; // Setze den Feind auf den nächsten Ritter
          }
        }
      });
      if (nearestKnight) {
        nearestKnight.energy -= 5; // Verringere die Energie des Feindes bei einem Treffer
        if (nearestKnight.energy <= 0) { // Wenn die Energie des Feindes 0 erreicht
          nearestKnight.energy = 0; // Energie kann nicht unter 0 fallen
          nearestKnight.isDead = true; // Setze den Feind auf tot
          nearestKnight.playAnimation(nearestKnight.IMAGES_DEAD); // Play death animation
          setTimeout(() => {
            const index = this.world.enemies.indexOf(nearestKnight);
            if (index > -1) {
              this.world.enemies.splice(index, 1); // Entferne den Feind aus dem Array
            }
          }, 2000); // Entferne den Feind nach 2 Sekunden
        } else {
          nearestKnight.playAnimation(nearestKnight.IMAGES_HURT); // Play hurt animation
        }
      }
    }
  }
  attackEndboss(endboss) {
    if (this.world.keyboard && this.world.keyboard.THROW) {
      this.playAnimation(this.IMAGES_FIRE_ATTACK);
      if (this.fire_attack_sound.paused) {
        this.fire_attack_sound.play(); // Spiele den Angriffssound ab
      }
      endboss.energy -= 20; // Verringere die Energie des Endbosses
      if (endboss.energy <= 0) {
        endboss.energy = 0;
        endboss.isDead = true;
        endboss.playAnimation(endboss.IMAGES_DEAD);
        setTimeout(() => {
          this.world.level.endboss = null; // Entferne den Endboss aus der Welt
        }, 2000);
      } else {
        endboss.playAnimation(endboss.IMAGES_HURT);
      }
    }
  }

  checkCollisionWithPoison() {
    if (this.world.poisonsArray) { // Überprüfe, ob es Giftobjekte gibt
      this.world.poisonsArray.forEach((poison) => {
        if (poison.isActive && this.checkCollision(poison)) {
          poison.deactivate(); // Giftflasche deaktivieren
          this.poisonCollected += 1; // Sammelzähler für Gift erhöhen
          this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Statusleiste aktualisieren
        }
      });
    }
  }

  isAboveGround() {
    return this.y < 150; // Passen Sie dies an die tatsächliche Bodenhöhe an
  }

  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT; // Prüfen, ob die Pfeiltasten für Bewegung gedrückt sind
  }
  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x); // Berechne den Abstand zwischen Charakter und Feind
    if (!this.invulnerable && distance < 100) { // Wenn der Charakter nicht unverwundbar ist und der Abstand kleiner als 100 ist
      this.energy -= 5; // Verringere die Energie bei einem Treffer
      if (this.energy <= 0) {
        this.energy = 0; // Energie kann nicht unter 0 fallen
      }
      this.healthBar.setPercentage(this.energy); // Aktualisiere die Statusleiste des Charakters
      this.invulnerable = true; // Setze den Charakter für eine kurze Zeit unverwundbar
      setTimeout(() => {
        this.invulnerable = false; // Nach 1 Sekunde wieder verwundbar machen
      }, 1000);
    }
  }
  isHurt() {
    return this.energy < 100 && this.energy > 0; // wenn seine < 100 und > 0 ist, dann ist er verletzt
  }
  isDead() {
    return this.energy == 0;// wenn seine Energie 0 ist, dann ist er tot
  }
  attackNearestKnight() {
    if (this.attackCooldown) return;

    const nearestKnight = this.findNearestKnight();
    if (nearestKnight) {
      nearestKnight.energy -= 5; // Verringere die Energie des Ritters
      nearestKnight.healthBar.setPercentage(nearestKnight.energy); // Aktualisiere die Statusleiste des Ritters
      if (nearestKnight.energy <= 0) {
        nearestKnight.energy = 0;
        nearestKnight.isDead = true;
        nearestKnight.playAnimation(nearestKnight.IMAGES_DEAD); // Play death animation
        setTimeout(() => {
          const index = this.world.enemies.indexOf(nearestKnight);
          if (index > -1) {
            this.world.enemies.splice(index, 1); // Entferne den Feind aus dem Array
          }
        }, 7000); // Entferne den Feind nach 7 Sekunden
      } else {
        nearestKnight.playAnimation(nearestKnight.IMAGES_HURT); // Play hurt animation
        nearestKnight.attackCharacter(this); // Ritter greift den Charakter an
      }
    }

    this.attackCooldown = true;
    setTimeout(() => {
      this.attackCooldown = false;
    }, 1500); // 1,5 Sekunden Abklingzeit
  }

  findNearestKnight() {
    if (!this.world.enemies) {
      return null;
    }
    let nearestKnight = null;
    let minDistance = Infinity;
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Knight) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance < minDistance) {
          minDistance = distance;
          nearestKnight = enemy;
        }
      }
    });
    return nearestKnight;
  }

  checkSnakeAttack() {
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Snake && this.isColliding(enemy)) {
        enemy.attackCharacter(this); // Schlange greift den Charakter an
      }
    });
  }

  throwPoisonAtSnake() {
    if (this.poisonCollected > 0) {
      const nearestSnake = this.findNearestSnake();
      if (nearestSnake) {
        nearestSnake.energy -= 20; // Verringere die Energie der Schlange
        if (nearestSnake.energy <= 0) {
          nearestSnake.energy = 0;
          nearestSnake.isDead = true;
          nearestSnake.playAnimation(nearestSnake.IMAGES_DEAD); // Play death animation
          setTimeout(() => {
            const index = this.world.enemies.indexOf(nearestSnake);
            if (index > -1) {
              this.world.enemies.splice(index, 1); // Entferne die Schlange aus dem Array
            }
          }, 2000); // Entferne die Schlange nach 2 Sekunden
        } else {
          nearestSnake.playAnimation(nearestSnake.IMAGES_HURT); // Play hurt animation
        }
        this.poisonCollected -= 1; // Verringere die gesammelten Giftflaschen
        this.poisonStatusBar.setPercentage(this.poisonCollected * 20); // Update die Statusleiste
      }
    }
  }

  findNearestSnake() {
    if (!this.world.enemies) {
      return null;
    }
    let nearestSnake = null;
    let minDistance = Infinity;
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Snake) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance < minDistance) {
          minDistance = distance;
          nearestSnake = enemy;
        }
      }
    });
    return nearestSnake;
  }

  resetForNewLevel() {
    this.x = 130;
    this.y = 150;
    this.coinsCollected = 0;
    this.poisonCollected = 0;
    this.energy = 100;
    this.healthBar.setPercentage(this.energy);
    this.coinStatusBar.setPercentage(0);
    this.poisonStatusBar.setPercentage(0);
  }
}