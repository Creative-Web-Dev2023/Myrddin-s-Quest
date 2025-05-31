/**
 * Contains all sound paths used in the game, structured by category.
 * @type {Object}
 * @property {Object} game - Game event sounds.
 * @property {Object} character - Character action sounds.
 * @property {Object} key - Key collection sound.
 * @property {Object} poison - Poison collection and throw sounds.
 * @property {Object} heart - Heart collection sound.
 * @property {Object} trap - Trap snap sound.
 * @property {Object} troll - Troll (endboss) sounds.
 * @property {Object} knight - Knight sounds.
 */

const SOUND_PATHS = {
  /**
   * Game event sounds.
   * @type {Object}
   * @property {string} background - Background music.
   * @property {string} you_win - Win sound.
   * @property {string} you_lose - Lose sound.
   */
  game: {
    background: "./assets/audio/woodsounds.mp3",
    you_win: "./assets/audio/game_won.mp3",
    you_lose: "./assets/audio/game_lost.mp3",
  },

  /**
   * Character action sounds.
   * @type {Object}
   * @property {string} walk - Walking sound.
   * @property {string} jump - Jumping sound.
   * @property {string} hurt - Hurt sound.
   * @property {string} die - Death sound.
   */
  character: {
    walk: "./assets/audio/walking.mp3",
    jump: "./assets/audio/jump.mp3",
    hurt: "./assets/audio/autsch.mp3",
    die: "./assets/audio/wizard_dying.mp3",
  },

  /**
   * Key collection sound.
   * @type {Object}
   * @property {string} collected - Key collected sound.
   */
  key: {
    collected: "./assets/audio/collect_key.mp3",
  },

  /**
   * Poison collection and throw sounds.
   * @type {Object}
   * @property {string} collected - Poison collected sound.
   * @property {string} thrown - Poison thrown sound.
   */
  poison: {
    collected: "./assets/audio/collect_bottle.mp3",
    thrown: "./assets/audio/throw_bottle.mp3",
  },

  /**
   * Heart collection sound.
   * @type {Object}
   * @property {string} collected - Heart collected sound.
   */
  heart: {
    collected: "./assets/audio/collect_heart.mp3",
  },

  /**
   * Trap snap sound.
   * @type {Object}
   * @property {string} snap - Trap snap sound.
   */
  trap: {
    snap: "./assets/audio/trap_snap.mp3",
  },

  /**
   * Troll (endboss) sounds.
   * @type {Object}
   * @property {string} hurt - Troll hurt sound.
   * @property {string} die - Troll death sound.
   */
  troll: {
    hurt: "./assets/audio/troll_hurt.mp3",
    die: "./assets/audio/troll_dying.mp3",
  },
  
  /**
   * Knight sounds.
   * @type {Object}
   * @property {string} hurt - Knight hurt sound.
   */
  knight: {
    hurt: "./assets/audio/knight-hurt.mp3",
  },
};
