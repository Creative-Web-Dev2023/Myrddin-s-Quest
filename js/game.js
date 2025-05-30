let canvas;
let ctx;
let keyboard = new Keyboard();
let world;
let IntervallIDs = [];
let loopId = null;

function init() {
  canvas = document.getElementById('canvas');
  preloadAssets();
}

function preloadImagesStructured(paths) {
  const result = {};
  collectPathsAsImages(paths, result);
  const allImages = extractAllImages(result);
  return waitForAllImagesToLoad(allImages, result);
}

function collectPathsAsImages(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === 'string') {
      const img = new Image();
      img.src = val;
      target[key] = img;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsImages(val, target[key]);
    }
  }
}

function extractAllImages(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLImageElement) {
        list.push(val);
      } else if (typeof val === 'object') {
        collect(val);
      }
    }
  })(obj);
  return list;
}

function waitForAllImagesToLoad(images, result) {
  return new Promise((resolve) => {
    let loaded = 0;
    images.forEach((img) => {
      img.onload = img.onerror = () => {
        if (++loaded === images.length) {
          resolve(result);
        }
      };
    });
  });
}

function preloadSoundsStructured(paths) {
  const result = {};
  collectPathsAsSounds(paths, result);
  const allSounds = extractAllSounds(result);
  return waitForAllSoundsToLoad(allSounds, result);
}

function collectPathsAsSounds(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === 'string') {
      const audio = new Audio(val);
      target[key] = audio;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsSounds(val, target[key]);
    }
  }
}

function extractAllSounds(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLAudioElement) {
        list.push(val);
      } else if (typeof val === 'object') {
        collect(val);
      }
    }
  })(obj);
  return list;
}

function waitForAllSoundsToLoad(sounds, result) {
  return new Promise((resolve) => {
    let loaded = 0;

    sounds.forEach((audio) => {
      const onLoaded = () => {
        audio.removeEventListener('canplaythrough', onLoaded);
        audio.removeEventListener('error', onLoaded);
        if (++loaded === sounds.length) {
          resolve(result);
        }
      };

      audio.addEventListener('canplaythrough', onLoaded);
      audio.addEventListener('error', onLoaded);
      audio.load();
    });

    if (sounds.length === 0) resolve(result);
  });
}

function preloadAssets() {
  document.getElementById('loadingMessage').classList.remove('d-none');

  Promise.all([
    preloadImagesStructured(IMAGE_PATHS),
    document.fonts.load('20px MedievalSharp'),
    preloadSoundsStructured(SOUND_PATHS),
  ])
    .then(([loadedImages, _, loadedSounds]) => {
      window.LOADED_IMAGES = loadedImages;
      window.LOADED_SOUNDS = loadedSounds;
      console.log('Geladene Bilder:', LOADED_IMAGES);
      console.log('Geladene Sounds:', LOADED_SOUNDS);
      document.getElementById('loadingMessage').classList.add('d-none');
      showInfoBox();
    })
    .catch((err) => {
      console.error('Fehler beim Laden der Assets:', err);
    });
}

function showInfoBox() {
  const startContainer = document.getElementById('start_container');

  startContainer.innerHTML += generateStartContentHTML();
}

function showContent(content) {
  const innerStartContainer = document.getElementById('inner_start_container');
  const instructionsBox = document.getElementById('instructions_box');
  innerStartContainer.classList.remove('d-none');
  instructionsBox.classList.add('d-none');
  if (content === 'startGame') {
    startGame();
  } else if (content === 'howToPlay') {
    innerStartContainer.classList.add('d-none');
    instructionsBox.classList.remove('d-none');
    instructionsBox.innerHTML = generateAboutGameHtml();
  } else if (content === 'imprint') {
    innerStartContainer.classList.add('d-none');
    instructionsBox.classList.remove('d-none');
    instructionsBox.innerHTML = generateImprintHtml();
  } else if (content === 'winnerScreen') {
    innerStartContainer.classList.add('d-none');
    instructionsBox.classList.remove('d-none');
    instructionsBox.innerHTML = generateWinnerScreen();
  }
}

function backToMainScreen() {
  const innerStartContainer = document.getElementById('inner_start_container');
  const instructionsBox = document.getElementById('instructions_box');
  innerStartContainer.classList.remove('d-none');
  instructionsBox.classList.add('d-none');
}

function startGame() {
  const startScreen = document.getElementById('startScreen');
  const canvas = document.getElementById('canvas');
  startScreen.classList.add('d-none');
  canvas.classList.remove('d-none');
  ctx = canvas.getContext('2d');
  const level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  keyboard.setupControls();
  // keyboard.setupTouchControls(world);
   if (music) {
    LOADED_SOUNDS.game.background.play();
  }
  gameLoop();
}

function gameLoop() {
  if (world.running === false) {
    cancelAnimationFrame(world.loopID);
    return;
  }

  world.update();
  world.draw();
  world.loopID = requestAnimationFrame(gameLoop);
}

function restartGame() {
  world = null;
  cancelAnimationFrame(loopId);
  loopId = null;

  startGame();
}

function showEndScreen(screenType) {
  canvas = document.getElementById('canvas');
  canvas.classList.add('d-none');
  const startScreen = document.getElementById('startScreen');
  const endScreen = document.getElementById('end_screen');
  startScreen.classList.add('d-none');
  endScreen.classList.remove('d-none');
  if (screenType === 'winnerScreen') {
    endScreen.innerHTML = generateWinnerScreenHTML();
  } else if (screenType === 'loserScreen') {
    endScreen.innerHTML = generateLoserScreenHTML();
  } else {
    console.error('Unknown screenType');
  }
}

function showStartScreen() {
  const startScreen = document.getElementById('startScreen');
  const endScreen = document.getElementById('end_screen');
  startScreen.classList.remove('d-none');
  endScreen.classList.add('d-none');
}

function toggleSound(soundType) {
  const musicButton = document.getElementById('music_button');
  const musicCaption = document.getElementById('music_caption');
  const noiseButton = document.getElementById('noise_button');
  const noiseCaption = document.getElementById('noise_caption');

  if (soundType === 'music') {
    music = !music;
    localStorage.setItem('music', music);

    musicButton.src = music
      ? './assets/img/game_ui/sounds/music_on.png'
      : './assets/img/game_ui/sounds/music_off.png';
    musicCaption.innerText = music ? 'Music on' : 'Music off';
  } else if (soundType === 'noise') {
    noises = !noises;
    localStorage.setItem('noises', noises);

    noiseButton.src = noises
      ? './assets/img/game_ui/sounds/noise_on.png'
      : './assets/img/game_ui/sounds/noise_off.png';
    noiseCaption.innerText = noises ? 'Noise on' : 'Noise off';
  } else {
    console.error('Unknown soundType', soundType);
  }
}