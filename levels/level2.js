// Stelle sicher, dass die Snake-Klasse importiert oder definiert ist
// import { Snake } from '../models/snake.class.js'; // Beispiel für Import, falls erforderlich

const level2 = new Level(
  [
    new Snake(2000, 200),
    new Snake(3000, 200),
    new Snake(4000, 200),
    // Endboss am Schluss
    new Endboss(),
  ],
  [new Cloud(), new Cloud(), new Cloud()],
  [
    new BackgroundObject("img/game_backgrounds/dark/7.png", -719), // Dunkler Hintergrund
    new BackgroundObject("img/game_backgrounds/dark/6.png", -719),
    new BackgroundObject("img/game_backgrounds/dark/4.png", -719, 0),
    new BackgroundObject("img/game_backgrounds/dark/3.png", -719, 100),
    new BackgroundObject("img/game_backgrounds/dark/2.png", -719),
    new BackgroundObject("img/game_items/candle.png", -685, 50, 10, 30), // Kerze 1
    new BackgroundObject("img/game_backgrounds/dark/1.png", -719),
    new BackgroundObject("img/game_backgrounds/dark/7.png", 0),
    new BackgroundObject("img/game_backgrounds/dark/6.png", 0),
    new BackgroundObject("img/game_backgrounds/dark/4.png", 0, 0),
    new BackgroundObject("img/game_backgrounds/dark/3.png", 0, 100),
    new BackgroundObject("img/game_backgrounds/dark/2.png", 0),
    new BackgroundObject("img/game_items/candle.png", 150, 50, 10, 30), // Kerze 2
    new BackgroundObject("img/game_backgrounds/dark/1.png", 0),
    new BackgroundObject("img/game_backgrounds/dark/7.png", 719),],
  );