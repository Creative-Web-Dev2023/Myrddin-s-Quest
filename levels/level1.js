const level1 = new Level(
  [
    // Erste Formation von drei Rittern
    new Knight(0, 900, 100), // erster Ritter startet bei x = 900 und bewegt sich auf einem Bereich von 100px
    new Knight(2000, 1500, 100), // zweiter Ritter startet mit 2 Sekunden Verzögerung bei x = 1500 und bewegt sich auf einem Bereich von 100px
    new Knight(4000, 2100, 100), // dritter Ritter startet mit 4 Sekunden Verzögerung bei x = 2100 und bewegt sich auf einem Bereich von 100px

    // Zweite Formation von drei Rittern
    new Knight(8000, 2700, 100), // erster Ritter der zweiten Formation startet bei x = 2700 mit 8 Sekunden Verzögerung und bewegt sich auf einem Bereich von 100px
    new Knight(10000, 3300, 100), // zweiter Ritter startet mit 10 Sekunden Verzögerung bei x = 3300 und bewegt sich auf einem Bereich von 100px
    new Knight(12000, 3900, 100), // dritter Ritter startet mit 12 Sekunden Verzögerung bei x = 3900 und bewegt sich auf einem Bereich von 100px

    // Schlangen hinzufügen
    new Snake(1000, 200),
    new Snake(2000, 200),
    new Snake(3000, 200),
    new Snake(4000, 200),

    // Endboss am Schluss
    new Endboss(),
  ],

  [new Cloud(), new Cloud(), new Cloud()],
  [
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
    new BackgroundObject("img/game_backgrounds/4/4.png", 719 * 3, 0), //
    new BackgroundObject("img/game_backgrounds/3/3.png", 719 * 3, 100), //
    new BackgroundObject("img/game_backgrounds/3/2.png", 719 * 3), //
    new BackgroundObject("img/game_items/candle.png", 2200, 50, 10, 30), // Kerze 5 x = 1110 y = 50 width = 50 height = 80
    new BackgroundObject("img/skull/scull 000.png", 2400, 50, 10, 30), //0 = x, 80 = y
    new BackgroundObject("img/game_backgrounds/4/1.png", 719 * 3), //

    // Füge mehr Hintergrundobjekte hinzu, um den Hintergrund zu verlängern
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
  ],
  [
    new PoisonObject(1000, 360, 100, 30), 
    new PoisonObject(1800, 360, 100, 30),
    new PoisonObject(2500, 360 , 100, 30),
  ]
);
