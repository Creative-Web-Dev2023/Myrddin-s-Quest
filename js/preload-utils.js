/**
 * Recursively extracts all HTMLImageElement instances from an object.
 */
function extractAllImages(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLImageElement) {
        list.push(val);
      } else if (typeof val === "object") {
        collect(val);
      }
    }
  })(obj);
  return list;
}

/**
 * Recursively extracts all HTMLAudioElement instances from an object.
 */
function extractAllSounds(obj) {
  const list = [];
  (function collect(o) {
    for (const key in o) {
      const val = o[key];
      if (val instanceof HTMLAudioElement) {
        list.push(val);
      } else if (typeof val === "object") {
        collect(val);
      }
    }
  })(obj);
  return list;
}

/**
 * Recursively replaces string paths in the source object with Image objects in the target object.
 */
function collectPathsAsImages(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === "string") {
      const img = new Image();
      img.src = val;
      target[key] = img;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsImages(val, target[key]);
    }
  }
}

/**
 * Recursively replaces string paths in the source object with Audio objects in the target object.
 */
function collectPathsAsSounds(src, target) {
  for (const key in src) {
    const val = src[key];
    if (typeof val === "string") {
      const audio = new Audio(val);
      target[key] = audio;
    } else {
      target[key] = Array.isArray(val) ? [] : {};
      collectPathsAsSounds(val, target[key]);
    }
  }
}

/**
 * Loads all audio elements and resolves when all are ready or errored.
 */
function loadSounds(sounds, result, loaded, resolve) {
  sounds.forEach((audio) => {
    const onLoaded = () => {
      audio.removeEventListener("canplaythrough", onLoaded);
      audio.removeEventListener("error", onLoaded);
      loaded++;
      if (loaded === sounds.length) resolve(result);
    };
    audio.addEventListener("canplaythrough", onLoaded);
    audio.addEventListener("error", onLoaded);
    audio.load();
  });
}

/**
 * Handles successful asset loading, assigns loaded assets to global variables, and updates the UI.
 */
function handleAssetLoadSuccess([loadedImages, _, loadedSounds]) {
  window.LOADED_IMAGES = loadedImages;
  window.LOADED_SOUNDS = loadedSounds;
  document.getElementById("loadingMessage").classList.add("d-none");
  showInfoBox();
}

/**
 * Handles asset loading errors by logging them to the console.
 */
function handleAssetLoadError(err) {
  console.error("Fehler beim Laden der Assets:", err);
}
