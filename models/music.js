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
    if (!musicIsOn) {
        backgroundMusic.play();
        backgroundMusic.loop = true;  // Musik in Endlosschleife
        musicIsOn = true;
    }
}

function stopMusic() {
    if (musicIsOn) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Musik von Anfang abspielen, wenn sie wieder gestartet wird
        musicIsOn = false;
        pauseAllSounds(); // Pausiere alle Sounds
        walkingSound.pause(); // Speziell Walking Sound pausieren
        walkingSound.currentTime = 0; // Zurücksetzen auf Anfang
    }
}


function pauseAllSounds() {
    allSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0; // Setze den Sound auf den Anfang zurück
    });
}

function playWalkingSound() {
    if (musicIsOn && walkingSound.paused) {
        walkingSound.play();
    } else if (!musicIsOn) {
        walkingSound.pause(); // Falls der Schalter off ist, Walking Sound pausieren
        walkingSound.currentTime = 0; // Zurücksetzen auf Anfang
    }
}


function playAttackSound() {
    if (musicIsOn && attackSound.paused) {
        attackSound.play();
    }
}

function playFireAttackSound() {
    if (musicIsOn && fireAttackSound.paused) {
        fireAttackSound.play();
    }
}

function playCollectCoinSound() {
    if (musicIsOn && collectCoinSound.paused) {
        collectCoinSound.play();
    }
}

function playPoisonBottleSound() {
    if (musicIsOn && throwPoisonBottleSound.paused) {
        throwPoisonBottleSound.play();
    }
}

function playJumpSound() {
    if (musicIsOn && jumpSound.paused) {
        jumpSound.play();
    }
}