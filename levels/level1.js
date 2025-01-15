const level1 = new Level(
  generateEnemiesLvl1(),
  generateEnvironmentsLvl1(),
  generateBackgroundsLvl1(),
 
);

function generateEnemiesLvl1() {
  return [
    new Knight(0, 900, 100, 1),
    new Knight(2000, 1500, 100, 2),
    new Knight(4000, 2100, 100, 3),
    new Knight(8000, 2700, 100, 4),
    new Knight(10000, 3300, 100, 5),
    new Knight(12000, 3900, 100, 6),
  ];
}

function generateEnvironmentsLvl1() {
  return [
    new Cloud(0, 50), // Fügen Sie x und y Positionen für die Wolken hinzu
    new Cloud(500, 100),
    new Cloud(1000, 150),
    new Key(4400, 130), // Schlüssel
    new Door(4500, 80) // Tür
  ];
}

function generateBackgroundsLvl1() {
  return [
    new BackgroundObject("img/game_backgrounds/4/7.png", -719), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/6.png", -719), // -719 = x, 0 = y
    new BackgroundObject("img/game_backgrounds/4/4.png", -719, 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/3.png", -719, 100), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/2.png", -719), // 719 = x, 80 = y
    new BackgroundObject("img/game_items/candle.png", -685, 50, 10, 30), // Kerze 1 x = -690 y = 50 width = 50 height = 80
    new BackgroundObject("img/game_backgrounds/4/1.png", -719), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/7.png", 0), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/6.png", 0), // 0 = x, 0 = y
    new BackgroundObject("img/game_backgrounds/4/4.png", 0, 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/3.png", 0, 100), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/2.png", 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_items/candle.png", 150, 50, 10, 30), // Kerze 2 x = 10 y = 50 width = 50 height = 80
    new BackgroundObject("img/game_backgrounds/4/1.png", 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/7.png", 719), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/6.png", 719), // 0 = x, 0 = y
    new BackgroundObject("img/game_backgrounds/4/4.png", 719, 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/3.png", 719, 100), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/2.png", 719), // 719 = x, 80 = y
    new BackgroundObject("img/game_items/candle.png", 740, 50, 10, 30), // Kerze 3 x = 440 y = 50 width = 50 height = 80
    new BackgroundObject("img/skull/scull 000.png", 950, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 2), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 2), // 0 = x, 0 = y
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 2, 0), // 719 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 2, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 2), //
    new BackgroundObject("img/game_items/candle.png", 1400, 50, 10, 30), // Kerze 3 x = 740 y = 50 width = 50 height = 80
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 2), //
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 3), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 3),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 3, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 3, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 3),
    new BackgroundObject("img/game_items/candle.png", 2200, 50, 10, 30), // Kerze 5 x = 1110 y = 50 width = 50 height = 80
    new BackgroundObject("img/skull/scull 000.png", 2400, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 3), //

    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 4, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 4, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 4),
    new BackgroundObject("img/game_items/candle.png", 3000, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 3200, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 4),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 5),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 5),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 5, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 5, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 5),
    new BackgroundObject("img/game_items/candle.png", 3700, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 3900, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 5),
    // Füge noch mehr Hintergrundobjekte hinzu, um sicherzustellen, dass kein schwarzer Bereich bleibt
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 6, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 6, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 6),
    new BackgroundObject("img/game_items/candle.png", 4400, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 4600, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 6),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 7, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 7, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 7),
    new BackgroundObject("img/game_items/candle.png", 5100, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 5300, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 7),
    new BackgroundObject("img/game_backgrounds/4/7.png", 719 * 8),
    new BackgroundObject("img/game_backgrounds/4/6.png", 719 * 8),
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 8, 0),
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 8, 100),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 8),
    new BackgroundObject("img/game_items/candle.png", 5800, 50, 10, 30),
    new BackgroundObject("img/skull/scull 000.png", 6000, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 8),
    
  ];
}
