const level1 = new Level(
    [
        new Knight(),
        new Knight(),
        new Knight(),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    [
        new BackgroundObject('img/game_backgrounds/4/7.png', -719), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', -719), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', -719, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', -719, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', -719), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/1.png', -719), // 719 = x, 80 = y

        new BackgroundObject('img/game_backgrounds/4/7.png', 0), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 0), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 0, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 98, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', 0), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/1.png', 0), // 719 = x, 80 = y

        new BackgroundObject('img/game_backgrounds/4/7.png', 719), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 719, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 719, 100), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/3/2.png', 719), // 719 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/1.png', 719), // 719 = x, 80 = y

        new BackgroundObject('img/game_backgrounds/4/7.png', 719 * 2), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719 * 2), // 0 = x, 0 = y
        new BackgroundObject('img/game_backgrounds/4/4.png', 719 * 2, 0), // 719 = x, 80 = y 
        new BackgroundObject('img/game_backgrounds/3/3.png', 719 * 2, 100), 
        new BackgroundObject('img/game_backgrounds/3/2.png', 719 * 2), // 
        new BackgroundObject('img/game_backgrounds/4/1.png', 719 * 2), // 

        new BackgroundObject('img/game_backgrounds/4/7.png', 719 * 3), //0 = x, 80 = y
        new BackgroundObject('img/game_backgrounds/4/6.png', 719 * 3),
        new BackgroundObject('img/game_backgrounds/4/4.png', 719 * 3, 0), //
        new BackgroundObject('img/game_backgrounds/3/3.png', 719 * 3, 100), //
        new BackgroundObject('img/game_backgrounds/3/2.png', 719 * 3), // 
        new BackgroundObject('img/game_backgrounds/4/1.png', 719 * 3), // 
    ]
);
 