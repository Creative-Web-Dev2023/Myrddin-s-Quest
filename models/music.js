let backgroundMusic = new Audio('audio/woodsounds.mp3');
let walkingSound = new Audio("audio/walking.mp3");
let attackSound = new Audio("audio/wizard_attack.mp3");
let fireAttackSound = new Audio("audio/fire_attack.mp3");
let collectCoinSound = new Audio("audio/collect_coins.mp3");
let throwPoisonBottleSound = new Audio("audio/throw-poison-bottle.mp3");
let jumpSound = new Audio("audio/jump.mp3");
let musicIsOn = false;
let allSounds = [backgroundMusic, walkingSound, attackSound, fireAttackSound, collectCoinSound, throwPoisonBottleSound, jumpSound];

function musicSwitcher() {
    const audioIcon = document.getElementById('audioSwitcher'); // Icon für Sound an/aus
    if (musicIsOn) {
        stopMusic();
        audioIcon.src = 'img/app_icons/soundoff.png'; // Icon für Sound aus
    } else {
        playMusic();
        audioIcon.src = 'img/app_icons/soundon.png'; // Icon für Sound an
    }
}

function playMusic() {
    backgroundMusic.play();
    backgroundMusic.loop = true;  // Musik in Endlosschleife
    musicIsOn = true;
}

function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;  // Musik von Anfang abspielen, wenn sie wieder gestartet wird
    musicIsOn = false;
    pauseAllSounds(); // Pausiere alle Sounds
}

function pauseAllSounds() {
    allSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0; // Setze den Sound auf den Anfang zurück
    });
}

function playWalkingSound() {
    if (musicIsOn) {
        walkingSound.play();
    }
}

function playAttackSound() {
    if (musicIsOn) {
        attackSound.play();
    }
}

function playFireAttackSound() {
    if (musicIsOn) {
        fireAttackSound.play();
    }
}

function playCollectCoinSound() {
    if (musicIsOn) {
        collectCoinSound.play();
    }
}

function playPoisonBottleSound() {
    if (musicIsOn) {
        throwPoisonBottleSound.play();
    }
}

function playJumpSound() {
    if (musicIsOn) {
        jumpSound.play();
    }
}