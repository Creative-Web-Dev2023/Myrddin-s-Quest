/**
 * Represents a game level, containing all objects and configuration for the level.
 */
class Level {
  /**
   * The background objects for the level.
   * @type {Background[]}
   */
  backgrounds;

  /**
   * The candle objects for the level.
   * @type {Candle[]}
   */
  candles;

  /**
   * The skull objects for the level.
   * @type {Skull[]}
   */
  skulls;

  /**
   * The knight enemy objects for the level.
   * @type {Knight[]}
   */
  knights;

  /**
   * The poison collectible objects for the level.
   * @type {PoisonObject[]}
   */
  poisons;

  /**
   * The heart collectible objects for the level.
   * @type {Heart[]}
   */
  hearts;

  /**
   * The key collectible object for the level.
   * @type {Key}
   */
  key;

  /**
   * The door object for the level.
   * @type {Door}
   */
  door;

  /**
   * The trap objects for the level.
   * @type {Trap[]}
   */
  traps;

  /**
   * The endboss enemy for the level.
   * @type {Endboss}
   */
  endboss;

  /**
   * The X position where the level ends.
   * @type {number}
   */
  level_end_x = 7000;

  /**
   * Creates a new Level instance.
   * @param {Background[]} backgrounds - The background objects.
   * @param {Candle[]} candles - The candle objects.
   * @param {Skull[]} skulls - The skull objects.
   * @param {Knight[]} knights - The knight enemy objects.
   * @param {PoisonObject[]} poisons - The poison collectible objects.
   * @param {Heart[]} hearts - The heart collectible objects.
   * @param {Key} key - The key collectible object.
   * @param {Door} door - The door object.
   * @param {Trap[]} traps - The trap objects.
   * @param {Endboss} endboss - The endboss enemy.
   */
  constructor(
    backgrounds,
    candles,
    skulls,
    knights,
    poisons,
    hearts,
    key,
    door,
    traps,
    endboss
  ) {
    this.backgrounds = backgrounds || [];
    this.candles = candles || [];
    this.skulls = skulls || [];
    this.knights = knights || [];
    this.poisons = poisons || [];
    this.hearts = hearts || [];
    this.key = key;
    this.door = door;
    this.traps = traps || [];
    this.endboss = endboss;
  }
}
