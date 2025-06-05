/**
 * Represents a game level, containing all objects and configuration for the level.
 */
class Level {
  backgrounds;
  candles;
  skulls;
  knights;
  poisons;
  hearts;
  key;
  door;
  traps;
  endboss;
  level_end_x = 7000;

  /**
   * Creates a new Level instance.
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
