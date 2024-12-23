const level2 = new Level(
  [
    new Snake(2000, 200),
    new Snake(3000, 200),
    new Snake(4000, 200),
    new Snake(5000, 200), // Neue Schlange hinzugefügt
    new Snake(6000, 200), // Neue Schlange hinzugefügt
    // Endboss am Schluss
    new Endboss(15000, 150), // Fügen Sie den Endboss hinzu,
  ],
  [new Cloud(), new Cloud(), new Cloud()],
  [
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
  ]
);

// Stelle sicher, dass das Level global verfügbar ist
window.level2 = level2;