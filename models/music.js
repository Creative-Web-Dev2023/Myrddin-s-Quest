let backgroundMusic = new Audio(
  "./assets/audio/woodsounds.mp3?v=" + new Date().getTime()
);
let walkingSound = new Audio("./assets/audio/walking.mp3");
let attackSound = new Audio("./assets/audio/wizard_attack.mp3");
let throwPoisonBottleSound = new Audio(
  "./assets/audio/throw-poison-bottle.mp3"
);
let collectPoisonBottleSound = new Audio("./assets/audio/collect_bottle.mp3");
let jumpSound = new Audio("./assets/audio/jump.mp3");
let musicIsOn = localStorage.getItem("musicIsOn") === "true";
let level1Sound = new Audio(
  "./assets/audio/woodsounds.mp3?v=" + new Date().getTime()
);
let level2Sound = new Audio("./assets/audio/level2_sound.mp3");
let snakeAttackSound = new Audio("./assets/audio/snake.mp3");
let enemyHitSound = new Audio("./assets/audio/knight-hurt.mp3");
let snakeDeadSound = new Audio("./assets/audio/snake_dying.mp3");

let allSounds = [
  backgroundMusic,
  walkingSound,
  attackSound,
  throwPoisonBottleSound,
  jumpSound,
  level1Sound,
  level2Sound,
  snakeAttackSound,
  enemyHitSound,
  collectPoisonBottleSound,
  snakeDeadSound,
];

/**
 * Toggles the music on and off.
 */
function musicSwitcher() {
  const audioIcon = document.getElementById("audioSwitcher");
  musicIsOn = !musicIsOn;
  localStorage.setItem("musicIsOn", musicIsOn);
  if (musicIsOn) {
    if (isAfterDoor) {
      playLevel2Sound();
    } else {
      playLevel1Sound();
    }
    audioIcon.src = "./assets/img/app_icons/soundon.png";
  } else {
    stopAllSounds();
    audioIcon.src = "./assets/img/app_icons/sound_off_orange.png";
  }
}

/**
 * Initializes the music settings based on the saved status in localStorage.
 */
function initializeMusicSettings() {
  const savedMusicStatus = localStorage.getItem("musicIsOn");
  musicIsOn = savedMusicStatus === "true";
  const audioIcon = document.getElementById("audioSwitcher");
  audioIcon.src = musicIsOn
    ? "./assets/img/app_icons/soundon.png"
    : "./assets/img/app_icons/sound_off_orange.png";
  stopAllSounds();
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

function stopWalkingSound() {
  if (!walkingSound.paused) {
    walkingSound.pause();
    walkingSound.currentTime = 0;
  }
}

/**
 * Plays the level 1 background sound.
 */
function playLevel1Sound() {
  if (musicIsOn) {
    stopAllSounds(); // Stoppe alle anderen Sounds
    level1Sound.loop = true;
    level1Sound.play().catch((error) => {
      console.error("Failed to play level 1 sound:", error);
    });
  }
}

/**
 * Plays the level 2 background sound.
 */
function playLevel2Sound() {
  if (musicIsOn) {
    stopAllSounds(); // Stoppe alle anderen Sounds
    level2Sound.loop = true;
    level2Sound.play().catch((error) => {
      console.error("Failed to play level 2 sound:", error);
    });
  }
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
    if (isAfterDoor) {
      playLevel2Sound(); // Spiele den Ton nach dem Tor
    } else {
      playLevel1Sound(); // Spiele den Ton vor dem Tor
    }
  }
}
/**
 * Plays the enemy hit sound.
 */
function playEnemyHitSound() {
  if (musicIsOn) {
    enemyHitSound.pause(); 
    enemyHitSound.currentTime = 0; 
    enemyHitSound.play().catch(error => {
      console.error("Failed to play enemy hit sound:", error);
    });
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

/**
 * Plays the snake dead sound.
 */
function playSnakeDyingSound() {
  if (musicIsOn) {
    snakeDeadSound.pause();
    snakeDeadSound.currentTime = 0;
    snakeDeadSound
      .play()
      .catch((e) =>
        console.error("Fehler beim Abspielen von snakeDeadSound", e)
      );
  }
}

/**
 * Plays a sound asynchronously.
 * @param {HTMLAudioElement} sound - The sound to play.
 */
async function playSoundAsync(sound) {
  try {
    if (musicIsOn && sound.paused) {
      await sound.play();
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}
