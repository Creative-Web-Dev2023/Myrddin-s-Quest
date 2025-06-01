/**
 * Indicates if background music is enabled.
 * @type {boolean}
 */
let music = localStorage.getItem("music") === "false" ? false : true;

/**
 * Indicates if sound effects are enabled.
 * @type {boolean}
 */
let noises = localStorage.getItem("noises") === "false" ? false : true;
