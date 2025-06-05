/**
 * Contains all sound paths used in the game, structured by category.
 */

const SOUND_PATHS = {
  /**
   * Game event sounds.
   */
  game: {
    background: "./assets/audio/woodsounds.mp3",
    you_win: "./assets/audio/game_won.mp3",
    you_lose: "./assets/audio/game_lost.mp3",
  },

  /**
   * Character action sounds.
   */
  character: {
    walk: "./assets/audio/walking.mp3",
    jump: "./assets/audio/jump.mp3",
    hurt: "./assets/audio/autsch.mp3",
    die: "./assets/audio/wizard_dying.mp3",
  },

  /**
   * Key collection sound.
   */
  key: {
    collected: "./assets/audio/collect_key.mp3",
  },

  /**
   * Poison collection and throw sounds.
   */
  poison: {
    collected: "./assets/audio/collect_bottle.mp3",
    thrown: "./assets/audio/throw_bottle.mp3",
  },

  /**
   * Heart collection sound.
   */
  heart: {
    collected: "./assets/audio/collect_heart.mp3",
  },

  /**
   * Trap snap sound.
   */
  trap: {
    snap: "./assets/audio/trap_snap.mp3",
  },

  /**
   * Troll (endboss) sounds.
   */
  troll: {
    hurt: "./assets/audio/troll_hurt.mp3",
    die: "./assets/audio/troll_dying.mp3",
  },
  
  /**
   * Knight sounds.
   */
  knight: {
    hurt: "./assets/audio/knight-hurt.mp3",
  },
};
