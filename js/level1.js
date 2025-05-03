/**
 * Initializes and returns the first level.
 * @returns {Level} The initialized level.
 */
function createLevel1() {
  return new Level(
    generateEnemiesLvl(),
    generateCloudsLvl(),
    generateKeyLvl(),
    generateDoorLvl(),
    generateBackgroundsLvl(),
    generatePoisonObjectsLvl(),
    generateTrapsLvl(),
    generateCrystalLvl()
  );
}

/**
 * Generates the enemies for the level.
 * @returns {Array} An array of enemies.
 */
function generateEnemiesLvl() {
  return [
    new Knight(0, 900, 100, 1),
    new Knight(2000, 1500, 100, 2),
    new Knight(4000, 2100, 100, 3),
    new Knight(8000, 2700, 100, 4),
    new Knight(10000, 3300, 100, 5),
    new Knight(12000, 3900, 100, 6),
    new Snake(7000, 200, 7),
    new Snake(8300, 200, 8),
    new Snake(9500, 200, 9),
    new Snake(10700, 200, 10),
    new Snake(11700, 200, 11),
    new Endboss(11800, 200, 12),
  ];
}

/**
 * Generates the environment objects for the level.
 * @returns {Array} An array of environment objects.
 */
function generateCloudsLvl() {
  console.log("[generateCloudsLvl] Wolken werden erstellt."); // Debug-Log
  return [
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
    new Cloud(),
  ]; // Rückgabe eines Arrays von Cloud-Objekten
}

/**
 * Generates the key for the level.
 * @returns {Key} The key object.
 */
function generateKeyLvl() {
  return new Key(LOADED_IMAGES.game_items.key, 4450, 110);
}

/**
 * Generates the background objects for the level.
 * @returns {Array} An array of background objects.
 */
function generateBackgroundsLvl() {
  return [
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, -719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, -719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood4, -719, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood3, -719, 100),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, -719),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, -685, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, -719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood4, 0, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood3, 0, 100),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 0),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 150, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood4, 719, 0),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood3, 719, 100),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 740, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 950, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 2),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 2),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 2,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 2,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 2),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 1400, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 2),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 3),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 3),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 3,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 3,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 3),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 2200, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 2400, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 3),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 4),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 4),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 4,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 4,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 4),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 3000, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 3200, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 4),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 5),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 5),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 5,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 5,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 5),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 3700, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 3900, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 5),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 6),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 6),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 6,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 6,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 6),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 4400, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 4600, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 6),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 7),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 7),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 7,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 7,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 7),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 5100, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 5300, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 7),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood7, 719 * 8),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood6, 719 * 8),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.green_wood.wood4,
      719 * 8,
      0
    ),
    new BackgroundObject(
      LOADED_IMAGES.backgrounds.blue_wood.wood3,
      719 * 8,
      100
    ),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood2, 719 * 8),
    new BackgroundObject(LOADED_IMAGES.game_items.candle, 5800, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.game_items.skull, 6000, 50, 10, 30),
    new BackgroundObject(LOADED_IMAGES.backgrounds.green_wood.wood1, 719 * 8),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 6471),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 7190),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 7910),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 8629),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 9348),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 10067),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 10786),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 11505),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 12225),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 12944),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 13000),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 13719),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 14438),
    new BackgroundObject(LOADED_IMAGES.backgrounds.blue_wood.wood2, 15157),
  ];
}

/**
 * Generates the poison objects for the level.
 * @returns {Array} An array of poison objects.
 */
function generatePoisonObjectsLvl() {
  return [
    new PoisonObject(LOADED_IMAGES.game_items.poison[0], 800, 400),
    new PoisonObject(LOADED_IMAGES.game_items.poison[1], 1600, 300),
    new PoisonObject(LOADED_IMAGES.game_items.poison[2], 2400, 200),
    new PoisonObject(LOADED_IMAGES.game_items.poison[3], 3200, 400),
    new PoisonObject(LOADED_IMAGES.game_items.poison[4], 4000, 300),
    new PoisonObject(LOADED_IMAGES.game_items.poison[5], 6400, 200),
  ];
}
/**
 * Generates the door for the level.
 * @returns {Door} The door object.
 */
function generateDoorLvl() {
  return new Door(4500, 80);
}

/**
 * Generates the traps for the level.
 * @returns {Array} An array of traps.
 */
function generateTrapsLvl() {
  return [
    new Trap(7500, 330),
    new Trap(8600, 330),
    new Trap(9900, 330),
    new Trap(11000, 330),
    new Trap(11700, 330),
  ];
}
/**
 * Generates the key for the level.
 * @returns {Key} The key object.
 */
function generateCrystalLvl() {
  return new Crystal(LOADED_IMAGES.game_items.crystal, 12000, 400);
}
