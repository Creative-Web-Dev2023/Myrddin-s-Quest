const level1 = new Level(
    [
         // Erste Formation von drei Rittern
         new Knight(0, 900),      // erster Ritter startet bei x = 900
         new Knight(2000, 1200),  // zweiter Ritter startet mit 2 Sekunden Verzögerung bei x = 1200
         new Knight(4000, 1500),  // dritter Ritter startet mit 4 Sekunden Verzögerung bei x = 1500
 
         // Zweite Formation von drei Rittern
         new Knight(8000, 2000),  // erster Ritter der zweiten Formation startet bei x = 2000 mit 8 Sekunden Verzögerung
         new Knight(10000, 2300), // zweiter Ritter startet mit 10 Sekunden Verzögerung bei x = 2300
         new Knight(12000, 2600), // dritter Ritter startet mit 12 Sekunden Verzögerung bei x = 2600
 
        new Endboss()
    ],

    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    [
        new BackgroundObject('img/game_backgrounds/4/7.png', -719), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', -719), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', -719, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', -719, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', -719), // 719 = x, 80 = y
        new BackgroundObject('img/game_items/candle.png', -685, 50, 10, 30), // Kerze 1 x = -690 y = 50 width = 50 height = 80
        new BackgroundObject('img/game_backgrounds/4/1.png', -719), // 719 = x, 80 = y
     
        new BackgroundObject('img/game_backgrounds/4/7.png', 0), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 0), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 0, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 98, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', 0), // 719 = x, 80 = y
        new BackgroundObject('img/game_items/candle.png', 150, 50, 10, 30), // Kerze 2 x = 10 y = 50 width = 50 height = 80
        new BackgroundObject('img/game_backgrounds/4/1.png', 0), // 719 = x, 80 = y
      
        new BackgroundObject('img/game_backgrounds/4/7.png', 719), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 719, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 719, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', 719), // 719 = x, 80 = y
        new BackgroundObject('img/game_items/candle.png', 740, 50, 10, 30), // Kerze 3 x = 440 y = 50 width = 50 height = 80
        new BackgroundObject('img/skull/scull 000.png', 950, 50, 10, 30), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/1.png', 719), // 719 = x, 80 = y
       
        new BackgroundObject('img/game_backgrounds/4/7.png', 719 * 2), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719 * 2), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 719 * 2, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 719 * 2, 100), 
        new BackgroundObject('img/game_backgrounds/3/2.png', 719 * 2), // 
        new BackgroundObject('img/game_items/candle.png', 1400, 50, 10, 30), // Kerze 3 x = 740 y = 50 width = 50 height = 80
        new BackgroundObject('img/game_backgrounds/4/1.png', 719 * 2), // 
       
        new BackgroundObject('img/game_backgrounds/4/7.png', 719 * 3), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719 * 3),
        new BackgroundObject('img/game_backgrounds/4/4.png', 719 * 3, 0), //
        new BackgroundObject('img/game_backgrounds/3/3.png', 719 * 3, 100), //
        new BackgroundObject('img/game_backgrounds/3/2.png', 719 * 3), // 
        new BackgroundObject('img/game_items/candle.png', 2200, 50, 10, 30), // Kerze 5 x = 1110 y = 50 width = 50 height = 80
        new BackgroundObject('img/game_backgrounds/4/1.png', 719 * 3), // 
    
        // new Coin(900, 350, 100, 30), //
        // new Coin(1300, 350, 100, 30),
        // new Coin(1700, 350, 100, 30),
        // new Coin(2100, 350, 100, 30),
        // new Coin(2530, 350, 100, 30),
    
    ],
    
);
