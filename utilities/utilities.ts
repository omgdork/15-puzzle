export default class Utilities {
  /**
   * Runs a function when the page is ready.
   * @param {Function} fn - The function to run when the page is ready.
   */
  static ready(fn: Function) {
      if ((<any>document).attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
          fn();
      } else {
          document.addEventListener('DOMContentLoaded', (e: Event) => {
              fn();
          });
      }
  }

  /**
   * Shuffles array in place. ES6 version.
   * @param {Array<any>} a - An array containing the items.
   */
  static shuffle(a: Array<any>) {
      for (let i: number = a.length - 1; i > 0; i--) {
          const j: number = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }

      return a;
  }
}
