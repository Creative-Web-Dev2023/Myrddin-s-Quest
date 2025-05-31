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

/**
 * Generates the background objects for the level.
 * @returns {Background[]} An array of Background objects.
 */
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

/**
 * Generates the candle objects for the level.
 * @returns {Candle[]} An array of Candle objects.
 */
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

/**
 * Generates the skull objects for the level.
 * @returns {Skull[]} An array of Skull objects.
 */
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

/**
 * Generates the knight enemies for the level.
 * @returns {Knight[]} An array of Knight objects.
 */
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
 * @returns {PoisonObject[]} An array of PoisonObject objects.
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

/**
 * Generates the heart objects for the level.
 * @returns {Heart[]} An array of Heart objects.
 */
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

/**
 * Generates the key object for the level.
 * @returns {Key} The Key object.
 */
function generateKeyLvl() {
  return new Key();
}

/**
 * Generates the door object for the level.
 * @returns {Door} The Door object.
 */
function generateDoorLvl() {
  return new Door();
}

/**
 * Generates the traps for the level.
 * @returns {Trap[]} An array of Trap objects.
 */
function generateTrapsLvl() {
  return [new Trap(800), new Trap(2100), new Trap(3500), new Trap(4900)];
}

/**
 * Generates the endboss for the level.
 * @returns {Endboss} The Endboss object.
 */
function generateEndboss() {
  return new Endboss();
}
