class Character extends MovableObject {
  height = 290;
  width = 520;
  x = 130;
  y = 150;
  speed = 5;
  
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
    'img/wizard/attack/attack_000.png',
    'img/wizard/attack/attack_001.png',
    'img/wizard/attack/attack_002.png',
    'img/wizard/attack/attack_003.png',
    'img/wizard/attack/attack_004.png',
    'img/wizard/attack/attack_005.png',
    'img/wizard/attack/attack_006.png',
    'img/wizard/attack/attack_007.png',
    'img/wizard/attack/attack_008.png',
    'img/wizard/attack/attack_009.png',
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

  world;
  walking_sound = new Audio("audio/walking.mp3");
  attack_sound = new Audio("audio/wizard_attack.mp3");


  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.applyGravity();
   
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
    this.playAnimation(this.IMAGES_IDLE);
    this.animate();
   
  }

animate() {
  let deadAnimationPlayed = false; // Flag, um die Dead-Animation nur einmal abzuspielen

  // Bewegungseingaben und Kamerabewegung
  setInterval(() => {
      if (!this.isDead()) {  // Nur bewegen, wenn der Charakter nicht tot ist
          this.walking_sound.pause();
          if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
              this.moveRight();
              this.otherDirection = false;
              this.walking_sound.play();
          }
          if (this.world.keyboard.LEFT && this.x > 0) {
              this.moveLeft();
              this.otherDirection = true;
              this.walking_sound.play();
          }
          if (this.world.keyboard.SPACE && !this.isAboveGround()) {
              this.jump();
          }
          this.world.camera_x = -this.x - 190;
      }
  }, 1000 / 60); // 60x pro Sekunde

  // Animationen für den Charakter
  setInterval(() => {
      if (this.isDead() && !deadAnimationPlayed) {
          this.playAnimation(this.IMAGES_DEAD);
          deadAnimationPlayed = true;  // Animation nur einmal abspielen
          this.speed = 0; // Stoppt alle Bewegungen
          this.speedY = 0;
          setTimeout(() => {
              // Letztes Bild der DEAD-Animation anzeigen, um das Wiederholen zu verhindern
              this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
          }, (this.IMAGES_DEAD.length - 1) * 100); // Wartezeit basierend auf Frameanzahl
      } else if (!this.isDead()) {
          deadAnimationPlayed = false;  // Setze Flag zurück, wenn der Charakter nicht tot ist
          if (this.isHurt()) {  
              this.playAnimation(this.IMAGES_HURT);
          } else if (this.world.keyboard.ATTACK) {  // Angriff abspielen
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
  }

  
  isMoving() {
    return this.keyboard.RIGHT || this.keyboard.LEFT; // Prüfen, ob die Pfeiltasten für Bewegung gedrückt sind
}

hit(enemy) {
  if (!this.invulnerable) {
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
    return this.energy < 100 && this.energy > 0; // Beispielhafte Bedingung für Verletzung
}

isDead() {
    return this.energy == 0;
}
}