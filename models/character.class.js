class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 150;
  speed = 5;
  coins = 0;
  coinStatusBar;
  invulnerable = false; // Neue Eigenschaft hinzufügen

  offset = {
    top: 13, // Reduziert das Rechteck von oben
    bottom: 15, // Reduziert das Rechteck von unten
    left: 199, // Reduziert das Rechteck von links
    right: 190, // Reduziert das Rechteck von rechts
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
    "img/wizard/attack/attack_000.png",
    "img/wizard/attack/attack_001.png",
    "img/wizard/attack/attack_002.png",
    "img/wizard/attack/attack_003.png",
    "img/wizard/attack/attack_004.png",
    "img/wizard/attack/attack_005.png",
    "img/wizard/attack/attack_006.png",
    "img/wizard/attack/attack_007.png",
    "img/wizard/attack/attack_008.png",
    "img/wizard/attack/attack_009.png",
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

  world = {};
  walking_sound = new Audio("audio/walking.mp3");
  attack_sound = new Audio("audio/wizard_attack.mp3");

  constructor(world, coinStatusBar) {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.world = world || {}; // Ensure world is initialized
    this.world.keyboard = {}; // Initialize keyboard property
    this.coinsCollected = 0; // Münzen gesammelt
    this.applyGravity();
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
    this.coinStatusBar = coinStatusBar || new CoinStatusBar(); // Statusleiste für Münzen
    this.coinStatusBar.setPercentage(20); // Initialize coin status bar to 20%
  }
  animate() {
    let deadAnimationPlayed = false; // Flag, um die Dead-Animation nur einmal abzuspielen
    // Bewegungseingaben und Kamerabewegung
    setInterval(() => {
      if (!this.isDead()) {
        // Nur bewegen, wenn der Charakter nicht tot ist
        this.walking_sound.pause();
        if (
          this.world.keyboard.RIGHT && // Prüfen, ob die rechte Pfeiltaste gedrückt ist
          this.x < this.world.level.level_end_x // Prüfen, ob der Charakter das Ende des Levels erreicht hat
        ) {
          this.moveRight(); // Charakter nach rechts bewegen
          this.otherDirection = false; // Richtung des Charakters auf rechts setzen
          this.walking_sound.play(); // Abspielen des Laufgeräuschs
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
          // Prüfen, ob die linke Pfeiltaste gedrückt ist und der Charakter nicht am linken Rand ist
          this.moveLeft(); // Charakter nach links bewegen
          this.otherDirection = true; // Richtung des Charakters auf links setzen
          this.walking_sound.play(); // Abspielen des Laufgeräuschs
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
          // Prüfen, ob die Leertaste gedrückt ist und der Charakter nicht in der Luft ist
          this.jump(); // Charakter springen lassen
        }
        if (this.world.keyboard.ATTACK) {
          this.attack(); // Angriff ausführen
        }
        this.world.camera_x = -this.x - 190; // Kamera an die Position des Charakters anpassen
      }
    }, 1000 / 60); // 60x pro Sekunde

    // Animationen für den Charakter
    setInterval(() => {
      if (this.isDead() && !deadAnimationPlayed) {
        //
        this.playAnimation(this.IMAGES_DEAD);
        deadAnimationPlayed = true; // Animation nur einmal abspielen
        this.speed = 0; // Stoppt alle Bewegungen
        this.speedY = 0;
        setTimeout(() => {
          // Letztes Bild der DEAD-Animation anzeigen, um das Wiederholen zu verhindern
          this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
        }, (this.IMAGES_DEAD.length - 1) * 100); // 100 ms zwischen den Frames
      } else if (!this.isDead()) {
        deadAnimationPlayed = false; // Setze Flag zurück, wenn der Charakter nicht tot ist
        if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.world.keyboard.ATTACK) {
          // Angriff abspielen
          this.playAnimation(this.IMAGES_ATTACK);
          this.attack_sound.play();
        } else if (this.isAboveGround()) {
          this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 100); // 100 ms zwischen den Frames für eine flüssige Animation
  }

  jump() {
    this.speedY = 33; // Die Geschwindigkeit des Sprungs
    this.collectCoins();
  }

  // Methode zur Kollisionserkennung
  checkCollision(coin) {
   return (
    this.x < coin.x + coin.width &&  // Der Charakter geht bis zum rechten Rand der Münze
    this.x + this.width > coin.x &&  // Der Charakter geht bis zum linken Rand der Münze
    this.y < coin.y + coin.height &&  // Der Charakter geht bis zum unteren Rand der Münze
    this.y + this.height > coin.y   // Der Charakter geht bis zum oberen Rand der Münze
   );
  }

  collectCoins() {
   if (this.world.coinsArray) {
     this.world.coinsArray.forEach((coin) => {
       if (coin.isActive && this.checkCollision(coin)) {
         coin.deactivate();
         this.coinsCollected++;
         this.coinStatusBar.setPercentage(20 + this.coinsCollected * 20); // Update the status bar starting from 20%
       }
     });
   }
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
        nearestKnight.energy -= 10; // Verringere die Energie des Feindes bei einem Treffer
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

  isMoving() {
    return this.keyboard.RIGHT || this.keyboard.LEFT; // Prüfen, ob die Pfeiltasten für Bewegung gedrückt sind
  }
  hit(enemy) {
    const distance = Math.abs(this.x - enemy.x); // Berechne den Abstand zwischen Charakter und Feind
    if (!this.invulnerable && distance < 100) { // Wenn der Charakter nicht unverwundbar ist und der Abstand kleiner als 100 ist
      this.energy -= 5; // Verringere die Energie bei einem Treffer
      if (this.energy <= 0) {
        this.energy = 0; // Energie kann nicht unter 0 fallen
      }
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
}