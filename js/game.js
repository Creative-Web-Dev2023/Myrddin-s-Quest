let canvas; // Define the canvas
let keyboard = new Keyboard();
let world; // Define the world object
let candleImage = new Image(); // Create the image object
let IntervallIDs = [];

function startGame() { // Start game function
  document.querySelector(".overlay").style.display = "none"; // Hide the overlay
  document.getElementById("audioSwitcher").classList.remove("hidden"); // Show the audio switcher
  document.getElementById("bigScreen").classList.remove("hidden"); // Show the fullscreen icon
  document.getElementById('key-info').classList.add('show');
  document.addEventListener('DOMContentLoaded', (event) => {

  });

  document.getElementById("audioSwitcher").setAttribute("onclick", "musicSwitcher()");
  init(); // Initialize the game
}

function init() { // Initialize the game
  canvas = document.getElementById("canvas"); // Get the canvas element
  world = new World(canvas, keyboard); // Ensure that World is defined
  playLevel1Sound(); // Play the background sound for level 1
  gameLoop();
}

function gameLoop() { // Game loop function
  world.update(); // Collision checks and other updates
  world.draw(); // Draw all objects, including character and coins
  world.checkThrowableObject(); // Regularly call checkThrowableObject method
  requestAnimationFrame(gameLoop); // Request the next frame
}

function handleDescription() { // Handle the description
  let description = document.getElementById("description");
  console.log(description); // Log the element to ensure it exists
  if (description.classList.contains("hidden")) {
    description.classList.remove("hidden");
    description.classList.add("show");
  } else {
    description.classList.remove("show");
    description.classList.add("hidden");
  }
}

function goBack() {
  let description = document.getElementById("description");
  let impressum = document.getElementById("impressum");
  description.classList.add("hidden"); // Hide description and impressum and show the overlay
  description.classList.remove("show");
  impressum.classList.add("hidden"); // Hide impressum
  impressum.classList.remove("show"); // Hide impressum
}

function quitGame() { // Quit game function
  location.reload(); // Reload the page to restart the game
}

function tryAgain() {
    // Verstecke den Game Over Screen
    document.getElementById('game-over-container').style.display = 'none';
    
    // Setze die Welt zurück, aber behalte das aktuelle Level
    const currentLevelIndex = world.currentLevelIndex;
    
    if (currentLevelIndex === 0) {
        // Wenn in Level 1
        world.character.reset(1);
        world.level = level1;
        world.enemies = level1.enemies;
        world.backgroundObjects = level1.backgroundObjects;
        stopAllSounds();
        playLevel1Sound();
    } else {
        // Wenn in Level 2
        world.character.reset(2);
        world.level = level2;
        world.enemies = level2.enemies;
        world.backgroundObjects = level2.backgroundObjects;
        world.level.endboss = level2.endboss;
        stopAllSounds();
        playLevel2Sound();
    }
    
    // Setze die Kamera zurück
    world.camera_x = -world.character.x - 190;
    
    // Setze die Statusbars zurück
    world.character.energy = 100;
    world.characterStatusBar.setPercentage(100);
    
    // Setze den Game Over Status zurück
    world.character.isDead = false;
    world.levelCompleted = false;
}

function continueToNextLevel() {   // Continue to the next level
  const overlay = document.getElementById('level-completed-overlay'); // Get the overlay
  if (overlay) { overlay.classList.remove('show');
  }
  loadLevel2(); // Load level 2
}

function loadLevel2() { // Load level 2
  if (typeof level2 !== 'undefined') {
    world.level = level2; // Set the current level to level 2
    world.character.reset(2); // Reset the character for level 2
    world.character.x = 0; // Set the character to the starting point of level 2
    world.backgroundObjects = level2.backgroundObjects; // Set the new background
    world.enemies = level2.enemies; // Set the new enemies (snakes and end boss)
    if (level2.endboss) { // Check if the end boss is defined
      world.level.endboss = level2.endboss; // Add the end boss only in level 2
    }
    stopAllSounds(); // Stop all running sounds
    playLevel2Sound(); // Play the background sound for level 2
  } else {
    console.error('Level 2 is not defined.');
  }
  if (this.door) { // Check if the door exists
    this.door = new Door(5500, 150); // New door for level 2
    this.door.world = this; // Assign the world to the door
  }
}

function playLevel2Sound() { // Play the background sound for level 2
  if (musicIsOn) {     // Check if music is on
    level2Sound.play(); // Play the sound
    level2Sound.loop = true; // Loop the sound
  }
}

function toggleFullscreen() { // Toggle fullscreen mode
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) { // If the document is not in full-screen mode
    canvas.requestFullscreen().catch(err => { // Request full-screen mode and catch errors
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Event listener for key presses

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 87) {
    keyboard.JUMP = true;
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = true; // Attack key
  }
  if (e.code === "KeyS") {
    keyboard.THROW = true; // Fire animation key
  }
  if (e.code === "KeyD") {
    keyboard.D = true; // D key
    if (world && world.character) {
      world.character.throwObject(); // Call character method throwObject
    }
  }
});

// Event listener for key releases
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 87) {
    keyboard.JUMP = false; // Release jump key
  }
  if (e.code === "KeyA") {
    keyboard.ATTACK = false; // Release attack key
  }
  if (e.code === "KeyS") {
    keyboard.THROW = false; // Release fire animation key
  }
  if (e.code === "KeyD") {
    keyboard.D = false; // Release D key
  }
});

// Add an event listener for the start button
window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", startGame);
  } else {
    console.error("Element with ID 'startButton' not found.");
  }
});

function handleImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.toggle("hidden");
  impressum.classList.toggle("show");
}

// Add an event listener for the fullscreen button
window.addEventListener("DOMContentLoaded", () => {
  const bigScreenButton = document.getElementById("bigScreen");
  if (bigScreenButton) {
    bigScreenButton.addEventListener("click", () => {
      toggleFullscreen();
    });
  } else {
    console.error("Element with ID 'bigScreen' not found.");
  }
});

function checkOrientation() {
  const rotateDiv = document.getElementById('rotate');
  if (window.innerWidth < 720 && window.innerHeight > window.innerWidth) {
    rotateDiv.style.display = 'flex';
  } else {
    rotateDiv.style.display = 'none';
  }
}

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);

// Initial check
window.addEventListener('load', checkOrientation);