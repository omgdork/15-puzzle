import Utilities from '../utilities/utilities.js';
import Tile from './tile.js';

export default class Board {
  constructor(size = 4, tileWidth = 20) {
    this.size = size;
    this.tileWidth = tileWidth;
    this.tiles = [];
    this.initBoard();
  }

  /**
   * Shuffles an array of n items until it can be solved
   * and then generates the board.
   */
  initBoard() {
    const tileCount = Math.pow(this.size, 2);
    let currentRow = 0;
    let currentColumn = 0;
    let tileOrder = Array.from({ length: tileCount}, (v, k) => k);

    do {
      tileOrder = Utilities.shuffle(tileOrder);
    } while (!this.isSolvable(tileOrder));

    this.tiles = tileOrder.map((v, i, arr) => {
      // The highest value is the blank tile.
      const tile = new Tile({
        value: v === tileCount ? 0 : v,
        row: currentRow,
        column: currentColumn,
        width: this.tileWidth,
        clickHandler: (value) => this.clickHandler(value),
      });

      // Set the row and column indices for the next tile.
      if (currentColumn === this.size - 1) {
        currentRow++;
        currentColumn = 0;
      } else {
        currentColumn++;
      }

      return tile;
    });
    
    this.generateBoard();
  }

  /**
   * Moves a clicked tile if possible.
   * @param {number} value - The tile value (order).
   */
  clickHandler(value) {
    if (!value) {
      return;
    }

    const tile = this.tiles.find((tile) => tile.value === value);
    const blankTile = this.tiles.find((tile) => tile.value === 0);

    // Check if the tile is adjacent to the blank tile.
    if ((tile.row === blankTile.row // Same row.
        && (tile.column === blankTile.column - 1 // Blank tile on the right.
          || tile.column === blankTile.column + 1)) // On the left.
      || (tile.column === blankTile.column // Same column.
        && (tile.row === blankTile.row - 1 // On top.
          || tile.row === blankTile.row + 1))) { // Down below.
      // If it is, switch coordinates.
      [tile.row, blankTile.row] = [blankTile.row, tile.row];
      [tile.column, blankTile.column] = [blankTile.column, tile.column];
      tile.move();
      blankTile.move();
      this.element.querySelector('.message').innerText = this.isSolved() ? 'Yazzzzz!' : '';
    } else {
      console.log(`Can't move the tile yo.`);
    }
  }

  /**
   * Adds a new board to the document body.
   */
  generateBoard() {
    this.element = document.createElement('div');
    const range = document.createRange();
    const template = `
      <div class="board" style="height: ${this.tileWidth * this.size}vmin; width: ${this.tileWidth * this.size}vmin;"></div>
      <p class="message"></p>
    `;
    const frag = range.createContextualFragment(template);
    const board = frag.querySelector('.board');

    this.element.classList.add('board-container');
    this.tiles.forEach((tile) => board.appendChild(tile.element));
    this.element.appendChild(frag);
  }

  // TODO: Fix!
  // From https://stackoverflow.com/a/34570524/769326
  /**
   * Checks if the given tile order is solvable.
   * @param {[number]} tileOrder - An array consisting of shuffled numbers.
   * @returns {boolean} Boolean value indicating if the shuffled array is solvable or not.
   */
  isSolvable(tileOrder) {
    const blankIndex = tileOrder.indexOf(tileOrder.length);
    const blankRow = Math.floor(blankIndex/this.size);
    let parity = 0;

    for (let i = 0, length = tileOrder.length; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        if (tileOrder[i] > tileOrder[j] && tileOrder[j] !== 0) {
          parity++;
        }
      }
    }

    // Even grid
    if (this.size % 2 === 0) {
      // Blank on odd row; counting from bottom.
      if (blankRow % 2 !== 0) {
        return parity % 2 === 0;
      }
      
      // Blank on even row; counting from bottom.
      return parity % 2 !== 0;
    }

    // Odd grid
    return parity % 2 === 0;
  }

  /**
   * Checks if the board is solved.
   * @returns {boolean} Boolean value indicating whether the board is solved or not.
   */
  isSolved() {
    return !this.tiles.some((tile, i, arr) => {
      const tileValue = tile.value || arr.length; // Set the blank tile's value as the last item.
      const rowShouldBe = parseInt((tileValue - 1)/this.size, 10);
      const columnShouldBe = (tileValue - 1)%this.size;
      const isCorrect = rowShouldBe === tile.row && columnShouldBe === tile.column;

      return !isCorrect;
    });
  }
}
