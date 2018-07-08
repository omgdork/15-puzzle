export default class Utilities {
  /**
   * Runs a function when the page is ready.
   * @param {function} fn - The function to run when the page is ready.
   */
  static ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // From https://stackoverflow.com/a/6274381
  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
