class Character extends MovableObject {
  height = 290;
  width = 520; // die Breite des Charakters
  x = 130; // x ist die Position des Charakters auf der x-Achse
  y = 80;
  speed = 15;


  offset = {
    top: 13,    // Reduziert das Rechteck von oben
    bottom: 15, // Reduziert das Rechteck von unten
    left: 199,   // Reduziert das Rechteck von links
    right: 190   // Reduziert das Rechteck von rechts
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

  world;
  walking_sound = new Audio("audio/walking.mp3");

  constructor() {
    // constructor bedeutet dass die function aufgerufen wird wenn ein neues Objekt erstellt wird
    super().loadImage("img/wizard/walk/walk_000.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity();
    this.animate();
  }
 
  animate() {
    // laufende Animation
    setInterval(() => {
      this.walking_sound.pause();
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        // der character kann nicht über den Rand hinausgehen
        this.moveRight();
        this.otherDirection = false;
        this.walking_sound.play();
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        // der character kann nicht über den Rand hinausgehen
        this.moveLeft();
        this.otherDirection = true;
        this.walking_sound.play();
      }
      // Hier fügen wir die Überwachung der Nach-oben-Taste hinzu
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        // wenn der character nicht über dem Boden ist, kann er springen
        this.jump();
      }
      this.world.camera_x = -this.x - 190;
    }, 1000 / 60); //60x pro Sekunde

    setInterval(() => {
      if (this.isAboveGround()) {
        //jump animation
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          //walk animation
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 120);
  }
 
  jump() {
    this.speedY = 33; // die Geschwindigkeit des Sprungs
  }
}
