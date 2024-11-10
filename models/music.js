let backgroundMusic = new Audio('audio/background music .mp3');
let musicIsOn =false;

function musicSwitcher(){
    const audioIcon = document.getElementById('audioSwitcher'); // Icon für Sound an/ausn
    if(musicIsOn){
        stopMusic();
        audioIcon.src = 'img/app_icons/soundoff.png'; // Icon für Sound aus
    }
    else{
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
}

