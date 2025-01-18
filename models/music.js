let backgroundMusic = new Audio('audio/woodsounds.mp3');
let walkingSound = new Audio("audio/walking.mp3");
let attackSound = new Audio("audio/wizard_attack.mp3");
let throwPoisonBottleSound = new Audio("audio/throw-poison-bottle.mp3");
let collectPoisonBottleSound = new Audio("audio/collect_bottle.mp3");
let jumpSound = new Audio("audio/jump.mp3");
let musicIsOn = false;
let level1Sound = new Audio('audio/woodsounds.mp3'); 
 
let allSounds = [backgroundMusic, walkingSound, attackSound, throwPoisonBottleSound, jumpSound, level1Sound];

function musicSwitcher() {
    const audioIcon = document.getElementById('audioSwitcher'); 
    musicIsOn = !musicIsOn;
    if (musicIsOn) {
        playLevel1Sound();
        audioIcon.src = 'img/app_icons/soundon.png'; 
    } else {
        stopAllSounds();
        audioIcon.src = 'img/app_icons/soundoff.png'; 
    }
}

function playMusic() {
    if (!musicIsOn) {
        backgroundMusic.play();
        backgroundMusic.loop = true; 
        musicIsOn = true;
    }
}

function stopMusic() {
    if (musicIsOn) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; 
        musicIsOn = false;
        pauseAllSounds(); 
        walkingSound.pause(); 
        walkingSound.currentTime = 0;
    }
}

function stopAllSounds() {
    level1Sound.pause();
    level1Sound.currentTime = 0;
    pauseAllSounds();
}

function pauseAllSounds() {
    allSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0; 
    });
}

function playWalkingSound() {
    if (musicIsOn && walkingSound.paused) {
        walkingSound.play();
    } else if (!musicIsOn) {
        walkingSound.pause(); 
        walkingSound.currentTime = 0;
    }
}

function playLevel1Sound() {
    if (musicIsOn) {
        level1Sound.play();
        level1Sound.loop = true;
    }
}


function playAttackSound() {
    if (musicIsOn && attackSound.paused) {
        attackSound.play();
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