
const level1 = new Level(
  generateEnemiesLvl(),
  generateEnvironmentsLvl(),
  generateBackgroundsLvl(), 
  generatePoisonObjectsLvl(), 
  generateTrapsLvl() // Initialisiere die Fallen
);

function generateEnemiesLvl() {
  return [
    new Knight(0, 900, 1),
    new Knight(2000, 1500, 2),
    new Knight(4000, 2100, 3),
    new Knight(8000, 2700, 4),
    new Knight(10000, 3300, 5),
    new Knight(12000, 3900, 6),
    new Key(4400, 130, 13), 
    new Snake(7000, 200, 7), 
    new Snake(8300, 200, 8),
    new Snake(8900, 200, 9),
    new Snake(9500, 200, 9), 
    new Snake(10700, 200, 10),
    new Snake(10000, 200, 10), 
    new Snake(11700, 200, 11), 
    new Endboss(11800, 200, 12),
    new Crystal(13660, 380),
  ];
}

function generateEnvironmentsLvl() {
  return [
    new Cloud(0, 50), 
    new Cloud(500, 100),
    new Cloud(1000, 150),
    new Door(4500, 80), 
    new Cloud(8000, 50),
    new Cloud(10500, 100),
    new Cloud(12000, 150),
  ];
}

function generateBackgroundsLvl() {
  return [
    new BackgroundObject("img/game_backgrounds/4/7.png", -719), 
    new BackgroundObject("img/game_backgrounds/4/6.png", -719), 
    new BackgroundObject("img/game_backgrounds/4/4.png", -719, 0), 
    new BackgroundObject("img/game_backgrounds/3/3.png", -719, 100), 
    new BackgroundObject("img/game_backgrounds/3/2.png", -719), 
    new BackgroundObject("img/game_items/candle.png", -685, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", -719), 
    new BackgroundObject("img/game_backgrounds/4/7.png", 0), 
    new BackgroundObject("img/game_backgrounds/4/6.png", 0), 
    new BackgroundObject("img/game_backgrounds/4/4.png", 0, 0), 
    new BackgroundObject("img/game_backgrounds/3/3.png", 0, 100), 
    new BackgroundObject("img/game_backgrounds/3/2.png", 0), 
    new BackgroundObject("img/game_items/candle.png", 150, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 0), 
    new BackgroundObject("img/game_backgrounds/4/7.png", 719), 
    new BackgroundObject("img/game_backgrounds/4/6.png", 719), 
    new BackgroundObject("img/game_backgrounds/4/4.png", 719, 0), 
    new BackgroundObject("img/game_backgrounds/3/3.png", 719, 100), 
    new BackgroundObject("img/game_backgrounds/3/2.png", 719), 
    new BackgroundObject("img/game_items/candle.png", 740, 50, 10, 30), 
    new BackgroundObject("img/skull/scull 000.png", 950, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719), 
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 2), 
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 2), 
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 2, 0), 
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 2, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 2), 
    new BackgroundObject("img/game_items/candle.png", 1400, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 2), 
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 3), 
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 3),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 3, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 3, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 3),
    new BackgroundObject("img/game_items/candle.png", 2200, 50, 10, 30), 
    new BackgroundObject("img/skull/scull 000.png", 2400, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 3), 
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 4, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 4, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 4),
    new BackgroundObject("img/game_items/candle.png", 3000, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 3200, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 5),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 5),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 5, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 5, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 5),
    new BackgroundObject("img/game_items/candle.png", 3700, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 3900, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 5),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 6, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 6, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 6),
    new BackgroundObject("img/game_items/candle.png", 4400, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 4600, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 7, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 7, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 7),
    new BackgroundObject("img/game_items/candle.png", 5100, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 5300, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 8),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 8),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 8, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 8, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 8),
    new BackgroundObject("img/game_items/candle.png", 5800, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 6000, 50, 10, 30), 
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 8),
    new BackgroundObject("img/game_backgrounds/3/2.png", 6471),
    new BackgroundObject("img/game_backgrounds/3/2.png", 7190),
    new BackgroundObject("img/game_backgrounds/3/2.png", 7910),
    new BackgroundObject("img/game_backgrounds/3/2.png", 8629),
    new BackgroundObject("img/game_backgrounds/3/2.png", 9348),
    new BackgroundObject("img/game_backgrounds/3/2.png", 10067),
    new BackgroundObject("img/game_backgrounds/3/2.png", 10786),
    new BackgroundObject("img/game_backgrounds/3/2.png", 11505),
    new BackgroundObject("img/game_backgrounds/3/2.png", 12225),
    new BackgroundObject("img/game_backgrounds/3/2.png", 12944),
    new BackgroundObject("img/game_backgrounds/3/2.png", 13000),
    new BackgroundObject("img/game_backgrounds/3/2.png", 13719),
    new BackgroundObject("img/game_backgrounds/3/2.png", 14438),
    new BackgroundObject("img/game_backgrounds/3/2.png", 15157),
  ];
}

function generatePoisonObjectsLvl() {
  return [];
}

function generateTrapsLvl() {
  return [
    new Trap(7500, 330), 
    new Trap(8600, 330), 
    new Trap(9900, 330), 
    new Trap(11000, 330), 
    new Trap(11700, 330),
  ];
}




