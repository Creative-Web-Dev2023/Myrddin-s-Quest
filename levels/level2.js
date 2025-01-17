const level2 = new Level(
  generateEnemiesLvl2(),
  generateEnvironmentsLvl2(),
  generateBackgroundsLvl2(),
  generatePoisonObjectsLvl2(),
  generateTrapsLvl2()
);

function generateEnemiesLvl2() {
  const enemies = [
    new Snake(1000, 200, 101), 
    new Snake(1800, 200, 103),
    new Snake(2600, 200, 105),
    new Snake(3200, 200, 107),
    new Endboss(6000, 150, 108),
  ];
  console.log("Endboss in Feindliste:", enemies.find(enemy => enemy instanceof Endboss));
  return enemies;
}

function generateTrapsLvl2() {
  return [
    new Trap(1300, 355),
    new Trap(2400, 355),
    new Trap(3200, 355),
  ];
}

function generateEnvironmentsLvl2() {
  return [
    new Cloud(0, 50), 
    new Cloud(500, 100),
    new Cloud(1000, 150),
  ];
}

function generateBackgroundsLvl2() {
  return [
    new BackgroundObject("img/game_backgrounds/3/2.png", 0),
    new BackgroundObject("img/game_backgrounds/3/2.png", 719),
    new BackgroundObject("img/game_backgrounds/3/2.png", 1438),
    new BackgroundObject("img/game_backgrounds/3/2.png", 2157),
    new BackgroundObject("img/game_backgrounds/3/2.png", 2876),
    new BackgroundObject("img/game_backgrounds/3/2.png", 3595),
    new BackgroundObject("img/game_backgrounds/3/2.png", 4314),
    new BackgroundObject("img/game_backgrounds/3/2.png", 5033),
    new BackgroundObject("img/game_backgrounds/3/2.png", 5752),
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
    new BackgroundObject("img/game_backgrounds/3/2.png", 13663),
    new BackgroundObject("img/game_backgrounds/3/2.png", 14382),
    new BackgroundObject("img/game_backgrounds/3/2.png", 15101),
    new BackgroundObject("img/game_backgrounds/3/2.png", 15820),
  ];
}

function generatePoisonObjectsLvl2() {
  return [
    
  ];
}

