let backgroundMusic = new Audio('audio/woodsounds.mp3');
let walkingSound = new Audio("audio/walking.mp3");
let attackSound = new Audio("audio/wizard_attack.mp3");
let fireAttackSound = new Audio("audio/fire_attack.mp3");
let throwPoisonBottleSound = new Audio("audio/throw-poison-bottle.mp3");
let collectPoisonBottleSound = new Audio("audio/collect_bottle.mp3");
let jumpSound = new Audio("audio/jump.mp3");
let musicIsOn = false;
let level1Sound = new Audio('audio/background music .mp3'); // Hintergrundsound für Level 1
let level2Sound = new Audio('audio/level2_sound.mp3'); // Hintergrundsound für Level 2
let allSounds = [backgroundMusic, walkingSound, attackSound, fireAttackSound, throwPoisonBottleSound, jumpSound, level1Sound, level2Sound];

function musicSwitcher() {
    const audioIcon = document.getElementById('audioSwitcher'); // Icon für Sound an/aus
    musicIsOn = !musicIsOn;
    if (musicIsOn) {
        if (world.level === level2) {
            playLevel2Sound();
        } else {
            playLevel1Sound();
        }
        audioIcon.src = 'img/app_icons/soundon.png'; // Icon für Sound an
    } else {
        stopAllSounds();
        audioIcon.src = 'img/app_icons/soundoff.png'; // Icon für Sound aus
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

function stopAllSounds() {
    level1Sound.pause();
    level1Sound.currentTime = 0;
    level2Sound.pause();
    level2Sound.currentTime = 0;
    pauseAllSounds();
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

function playLevel1Sound() {
    if (musicIsOn) {
        level1Sound.play();
        level1Sound.loop = true; // Wiederhole den Sound
    }
}

function playLevel2Sound() {
    if (musicIsOn) {
        level2Sound.play();
        level2Sound.loop = true; // Wiederhole den Sound
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
function playCollectPoisonBottleSound() {
    if (musicIsOn && collectPoisonBottleSound.paused) {
        collectPoisonBottleSound.play();
    }
}