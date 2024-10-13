class Character extends MovableObject {
  height = 290;
  width = 520; // Die Breite des Charakters
  x = 130; // Position des Charakters auf der x-Achse
  y = 80;
  speed = 15;
  isDeadAnimationPlaying = false;  // Überwacht die Dead-Animation

  offset = {
    top: 13,    // Reduziert das Rechteck von oben
    bottom: 15, // Reduziert das Rechteck von unten
    left: 199,  // Reduziert das Rechteck von links
    right: 190  // Reduziert das Rechteck von rechts
  };

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
    "img/wizard/die/die_009.png"
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
    "img/wizard/hurt/hurt_009.png"
  ];

  world;
  walking_sound = new Audio("audio/walking.mp3");

  constructor() {
    super().loadImage("img/wizard/walk/walk_000.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    this.energy = 100; // Setzt die Energie zu Beginn des Spiels auf 100
  }

  animate() {    // Laufende Animation
    setInterval(() => {
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
    }, 1000 / 60); // 60x pro Sekunde

    setInterval(() => {
      if (this.isDead()) {
        if (!this.isDeadAnimationPlaying) {
          this.playAnimation(this.IMAGES_DEAD);  // Dead-Animation einmal abspielen
          this.isDeadAnimationPlaying = true;   // Markiere Dead-Animation als abgespielt
        }
      } else if (this.isHurt()) {  
          this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
          this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
      }
    }, 120);
  }

  jump() {
    this.speedY = 33; // Die Geschwindigkeit des Sprungs
  }

  hit() {
    if (!this.invulnerable) {  // Schaden wird nur erlitten, wenn der Charakter nicht unverwundbar ist
      this.energy -= 5;  // Verringere die Energie bei einem Treffer
      if (this.energy <= 0) {
        this.energy = 0;  // Energie kann nicht unter 0 fallen
      }
    }
  }

  isHurt() {
    return this.energy < 100 && this.energy > 0;  // Beispielhafte Bedingung für Verletzung
  }

  isDead() {
    return this.energy == 0;
  }
}
