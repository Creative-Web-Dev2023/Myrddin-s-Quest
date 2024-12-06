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
  poisonStatusBar; // Füge die PoisonStatusBar hinzu

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
    this.loadImages(this.IMAGES_YOU_LOST);
  }

  throwObject() {
    if (this.world && this.world.throwableObjects) {
      const throwableObject = new ThrowableObject(this.x + this.width / 2, this.y + this.height / 2);
      this.world.throwableObjects.push(throwableObject);
      playPoisonBottleSound(); // Spiele den Sound ab, wenn die Flasche geworfen wird
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
          this.showYouLostAnimation(); // Zeige die "You Lost" Animation
        }
      } else if (this.world.keyboard && this.world.keyboard.THROW) {
        this.playAnimation(this.IMAGES_FIRE_ATTACK);
        if (fireAttackSound.paused) {
          playFireAttackSound(); // Spiele den Angriffssound ab
        }
      } else if (this.world.keyboard && this.world.keyboard.ATTACK) {
        this.playAnimation(this.IMAGES_ATTACK);
        if (attackSound.paused) {
          playAttackSound();
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
        this.playAnimation(this.IMAGES_WALKING);
        if (walkingSound.paused) {
          playWalkingSound();
        }
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  showYouLostAnimation() {
    this.currentImage = 0; // Reset animation frame
    this.playAnimation(this.IMAGES_YOU_LOST);
    setTimeout(() => {
      // Optional: Füge hier Logik hinzu, um das Spiel neu zu starten oder zum Hauptmenü zurückzukehren
    }, 2000); // Zeige die "You Lost" Animation für 3 Sekunden
  }

  update() {
    if (!this.isDead()) {
      walkingSound.pause();
      if (this.world.keyboard && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { 
        this.moveRight();
        this.otherDirection = false;
        playWalkingSound();
      }
      if (this.world.keyboard && this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        playWalkingSound();
      }
      if (this.world.keyboard && this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x - 190;
      this.collectCoins();
      this.collectPoison(); // Überprüfe Kollision mit Giftflaschen
      this.checkJumpOnKnight(); // Überprüfe, ob der Charakter auf einen Ritter springt
      this.checkKnightAttack(); // Überprüfe, ob der Ritter den Charakter angreifen soll
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
          if (collectCoinSound.paused) {
            playCollectCoinSound(); // Spiele den Münzensammelsound ab
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
 
  attackEndboss(endboss) {
    if (this.world.keyboard && this.world.keyboard.THROW) {
      this.playAnimation(this.IMAGES_FIRE_ATTACK);
      if (fireAttackSound.paused) {
        playFireAttackSound(); // Spiele den Angriffssound ab
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

  checkJumpOnKnight() {
    let nearestKnight = null;
    let minDistance = Infinity;
  
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Knight && this.isColliding(enemy) && this.speedY < 0) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance < minDistance) {
          minDistance = distance;
          nearestKnight = enemy;
        }
      }
    });
  
    if (nearestKnight) {
      nearestKnight.die(); // Set knight to dead state
    }
  }
 
  checkKnightAttack() {
    this.world.enemies.forEach((enemy) => {
      if (enemy instanceof Knight) {
        const distance = Math.abs(this.x - enemy.x);
        if (distance <= 50 && !this.isAboveGround()) { // Überprüfen, ob der Charakter sehr nahe ist und nicht in der Luft
          enemy.playAnimation(enemy.IMAGES_ATTACK); // Spiele die Angriffsanimation des Ritters
          setTimeout(() => {
            if (!this.isAboveGround() && distance <= 50) { // Überprüfe erneut, ob der Charakter nicht in der Luft ist und sehr nahe ist
              this.hit(enemy); // Der Ritter greift den Charakter an
            }
          }, 500); // Warte 0,5 Sekunden, bevor der Angriff ausgeführt wird
        }
      }
    });
  }
 
}