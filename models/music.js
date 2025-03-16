let backgroundMusic = new Audio("audio/woodsounds.mp3");
let walkingSound = new Audio("audio/walking.mp3");
let attackSound = new Audio("audio/wizard_attack.mp3");
let throwPoisonBottleSound = new Audio("audio/throw-poison-bottle.mp3");
let collectPoisonBottleSound = new Audio("audio/collect_bottle.mp3");
let jumpSound = new Audio("audio/jump.mp3");
let musicIsOn = false;
let level1Sound = new Audio("audio/woodsounds.mp3");
let level2Sound = new Audio("audio/level2_sound.mp3");
let snakeAttackSound = new Audio("audio/snake.mp3");

let allSounds = [
  backgroundMusic,
  walkingSound,
  attackSound,
  throwPoisonBottleSound,
  jumpSound,
  level1Sound,
  level2Sound,
  snakeAttackSound, // Fügen Sie den Schlangensound zur Liste hinzu
];

/**
 * Toggles the music on and off.
 */
function musicSwitcher() {
  const audioIcon = document.getElementById("audioSwitcher");
  musicIsOn = !musicIsOn;
  if (musicIsOn) {
    if (isAfterDoor) {
      playLevel2Sound();
    } else {
      playLevel1Sound();
    }
    audioIcon.src = "img/app_icons/soundon.png";
  } else {
    stopAllSounds();
    audioIcon.src = "img/app_icons/sound_off_orange.png";
  }
}

/**
 * Plays the background music.
 */
function playMusic() {
  if (!musicIsOn) {
    backgroundMusic.play();
    backgroundMusic.loop = true;
    musicIsOn = true;
  }
}

/**
 * Stops the background music.
 */
function stopMusic() {
  if (musicIsOn) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicIsOn = false;
    stopAllSounds();
  }
}

/**
 * Stops all sounds.
 */
function stopAllSounds() {
  allSounds.forEach((sound) => {
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    }
  });
}

/**
 * Pauses all sounds.
 */
function pauseAllSounds() {
  allSounds.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}

/**
 * Plays the walking sound.
 */
function playWalkingSound() {
  if (musicIsOn && walkingSound.paused) {
    walkingSound.play();
    walkingSound.onended = () => {
      walkingSound.currentTime = 0;
    };
  }
}

/**
 * Plays the level 1 background sound.
 */
function playLevel1Sound() {
  if (musicIsOn) {
    level1Sound.loop = true;
    level1Sound.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });
  }
}

/**
 * Plays the level 2 background sound.
 */
async function playLevel2Sound() {
  await playSoundAsync(level2Sound);
}

/**
 * Plays the attack sound.
 */
async function playAttackSound() {
  await playSoundAsync(attackSound);
}

/**
 * Plays the poison bottle throw sound.
 */
function playPoisonBottleSound() {
  if (musicIsOn && throwPoisonBottleSound.paused) {
    throwPoisonBottleSound.play();
  }
}

/**
 * Plays the jump sound.
 */
function playJumpSound() {
  if (musicIsOn && jumpSound.paused) {
    jumpSound.play();
  }
}

/**
 * Plays the collect poison bottle sound.
 */
function playCollectPoisonBottleSound() {
  if (musicIsOn && collectPoisonBottleSound.paused) {
    collectPoisonBottleSound.play();
  }
}

/**
 * Plays the new level sound.
 */
function playNewSound() {
  if (musicIsOn) {
    stopAllSounds();
    level2Sound.play();
    level2Sound.loop = true;
  }
}

/**
 * Plays the snake attack sound.
 */
function playSnakeAttackSound() {
  if (musicIsOn && snakeAttackSound.paused) {
    snakeAttackSound.play();
  }
}

async function playSoundAsync(sound) {
  try {
    if (musicIsOn && sound.paused) {
      await sound.play();
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}
