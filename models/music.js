let backgroundMusic = new Audio(
  "audio/woodsounds.mp3?v=" + new Date().getTime()
);
let walkingSound = new Audio("audio/walking.mp3");
let attackSound = new Audio("audio/wizard_attack.mp3");
let throwPoisonBottleSound = new Audio("audio/throw-poison-bottle.mp3");
let collectPoisonBottleSound = new Audio("audio/collect_bottle.mp3");
let jumpSound = new Audio("audio/jump.mp3");
let musicIsOn = localStorage.getItem("musicIsOn") === "true";
let level1Sound = new Audio("audio/woodsounds.mp3?v=" + new Date().getTime());
let level2Sound = new Audio("audio/level2_sound.mp3");
let snakeAttackSound = new Audio("audio/snake.mp3");
let enemyHitSound = new Audio("audio/knight-hurt.mp3");
let snakeDeadSound = new Audio("audio/snake_dying.mp3");

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
];

/**
 * Toggles the music on and off.
 */
function musicSwitcher() {
  const audioIcon = document.getElementById("audioSwitcher");
  musicIsOn = !musicIsOn;
  localStorage.setItem("musicIsOn", musicIsOn); // Speichere den Status in localStorage
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
 * Lädt den Mute-Status aus localStorage und setzt ihn entsprechend.
 */
function initializeMusicSettings() {
  const savedMusicStatus = localStorage.getItem("musicIsOn");
  musicIsOn = savedMusicStatus === "true"; 
  const audioIcon = document.getElementById("audioSwitcher");
  if (musicIsOn) {
    audioIcon.src = "img/app_icons/soundon.png";
    if (isAfterDoor) {
      playLevel2Sound();
    } else {
      playLevel1Sound(); 
    }
  } else {
    audioIcon.src = "img/app_icons/sound_off_orange.png";
    stopAllSounds();
  }
}

document.addEventListener("DOMContentLoaded", initializeMusicSettings);

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
    level1Sound.loop = true;
    level1Sound.play().catch((error) => {
      console.error("Failed to play level 1 sound:", error);
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
 * Plays the enemy hit sound.
 */
function playEnemyHitSound() {
  if (musicIsOn) {
    if (enemyHitSound.readyState >= 2) {
      // Überprüfen, ob der Sound geladen ist
      enemyHitSound.currentTime = 0;
      enemyHitSound.play().catch((error) => {
        console.error("Failed to play enemy hit sound:", error);
      });
    } else {
      console.warn("Enemy hit sound is not ready to play.");
    }
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
  const audio = new Audio("audio/snake_dying.mp3");
  audio.play();
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
