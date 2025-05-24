/**
 * Initializes and returns the first level.
 * @returns {Level} The initialized level.
 */
// const level1 = initLevel();

/**
 * Initializes the level by generating enemies, environments, backgrounds, poison objects, and traps.
 * @returns {Level} The initialized level.
 */
function createLevel1() {
  return new Level(
    generateBackgroundsLvl(),
    generateCandlesLvl(),
    generateSkullsLvl(),
    generateKnightsLvl(),
    generatePoisonsLvl(),
    generateHeartsLvl(),
    generateKeyLvl(),
    generateDoorLvl(),
    generateTrapsLvl(),
    generateEndboss()
  );
}

function generateBackgroundsLvl() {
  return [
    new Background(LOADED_IMAGES.backgrounds.wood0, -960),
    new Background(LOADED_IMAGES.backgrounds.wood1, -960),
    new Background(LOADED_IMAGES.backgrounds.wood2, -960),
    new Background(LOADED_IMAGES.backgrounds.wood3, -960),
    new Background(LOADED_IMAGES.backgrounds.wood4, -960),
    new Background(LOADED_IMAGES.backgrounds.wood5, -960),
    new Background(LOADED_IMAGES.backgrounds.wood0, 0),
    new Background(LOADED_IMAGES.backgrounds.wood1, 0),
    new Background(LOADED_IMAGES.backgrounds.wood2, 0),
    new Background(LOADED_IMAGES.backgrounds.wood3, 0),
    new Background(LOADED_IMAGES.backgrounds.wood4, 0),
    new Background(LOADED_IMAGES.backgrounds.wood5, 0),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 2),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 3),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 4),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 5),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 6),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 7),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 8),
    new Background(LOADED_IMAGES.backgrounds.wood0, 960 * 9),
    new Background(LOADED_IMAGES.backgrounds.wood1, 960 * 9),
    new Background(LOADED_IMAGES.backgrounds.wood2, 960 * 9),
    new Background(LOADED_IMAGES.backgrounds.wood3, 960 * 9),
    new Background(LOADED_IMAGES.backgrounds.wood4, 960 * 9),
    new Background(LOADED_IMAGES.backgrounds.wood5, 960 * 9),
  ];
}

function generateCandlesLvl() {
  return [
    new Candle(-154),
    new Candle(806),
    new Candle(1766),
    new Candle(2726),
    new Candle(3686),
    new Candle(4646),
    new Candle(5606),
  ];
}

function generateSkullsLvl() {
  return [
    new Skull(-200),
    new Skull(760),
    new Skull(1720),
    new Skull(2680),
    new Skull(3640),
    new Skull(4600),
    new Skull(5560),
    new Skull(6360),
  ];
}

function generateKnightsLvl() {
  return [
    new Knight(500),
    new Knight(1600),
    new Knight(2100),
    new Knight(3700),
    new Knight(4800),
    new Knight(5400),
  ];
}

/**
 * Generates the poison objects for the level.
 * @returns {Array} An array of poison objects.
 */
function generatePoisonsLvl() {
  return [
    new PoisonObject(400),
    new PoisonObject(800),
    new PoisonObject(1600),
    new PoisonObject(3300),
    new PoisonObject(3700),
    new PoisonObject(4400),
  ];
}

function generateHeartsLvl() {
  return [
    new Heart(560),
    new Heart(1100),
    new Heart(2000),
    new Heart(2680),
    new Heart(3110),
    new Heart(3550),
    new Heart(4800),
    new Heart(5400),
  ];
}

function generateKeyLvl() {
  return new Key();
}

function generateDoorLvl() {
  return new Door();
}

/**
 * Generates the traps for the level.
 * @returns {Array} An array of traps.
 */
function generateTrapsLvl() {
  return [ new Trap(800),new Trap(1600),new Trap(2600),new Trap(3400)];
}

function generateEndboss() {
  return new Endboss();
}