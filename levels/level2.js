const level2 = new Level(
  generateEnemiesLvl2(),
  generateEnvironmentsLvl1(), // Verwende die gleiche Funktion wie in Level 1
  generateBackgroundsLvl2(),
);

function generateEnemiesLvl2() {
  return [
    new Snake(900, 200),
    new Snake(1400, 200),
    new Snake(2000, 200),
    new Snake(2900, 200), // Neue Schlange hinzugefügt
    new Snake(4100, 200), // Neue Schlange hinzugefügt
    // Endboss am Schluss
    new Endboss(15000, 150), // Fügen Sie den Endboss hinzu
  ];
}
function generateEnvironmentsLvl1() {
  return [
    new Cloud(0, 50), // Fügen Sie x und y Positionen für die Wolken hinzu
    new Cloud(500, 100),
    new Cloud(1000, 150),
  ];
}
function generateBackgroundsLvl2() {
  return [
    new BackgroundObject("img/game_backgrounds/3/2.png", 0), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 719), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 1438), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 2157), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 2876), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 3595), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 4314), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 5033), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 5752), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 6471), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 7190), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 7910), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 8629), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 9348), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 10067), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 10786), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 11505), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 12225), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 12944), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 13663), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 14382), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 15101), // Korrekte Position
    new BackgroundObject("img/game_backgrounds/3/2.png", 15820), // Korrekte Position
  ];
}

