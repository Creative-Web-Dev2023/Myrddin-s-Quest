/**
 * Global flags for controlling music and noise settings.
 * @type {Object}
 * @property {boolean} music - Indicates if music is enabled.
 * @property {boolean} noises - Indicates if noises are enabled.
 */
window.flags = {
  music: localStorage.getItem("music") !== "false",
  noises: localStorage.getItem("noises") !== "false",
};
