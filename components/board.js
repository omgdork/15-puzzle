import Utilities from '../utilities/utilities.js';
import Tile from './tile.js';

/**
 * Shuffles an array of n items until it can be solved
 * and then generates the board.
 */
function initBoard() {
  const tileCount = this.columns * this.rows;
  let currentRow = 0;
  let currentColumn = 0;
  let tileOrder = Array.from({ length: tileCount }, (v, k) => k + 1); // Array starting from 1 to n.

  do {
    tileOrder = Utilities.shuffle(tileOrder);
  } while (!isSolvable(tileOrder, this.columns, this.rows));

  this.tiles = tileOrder.map((v, i, arr) => {
    // The highest value is the blank tile.
    const tile = new Tile({
      value: v === arr.length ? 0 : v,
      row: currentRow,
      column: currentColumn,
      width: this.tileWidth,
    });

    // Set the row and column indices for the next tile.
    if (currentColumn === this.columns - 1) {
      currentRow++;
      currentColumn = 0;
    } else {
      currentColumn++;
    }

    return tile;
  });
  
  generateBoard.call(this);
}

/**
 * Adds a new board to the document body.
 */
function generateBoard() {
  this.element = document.createElement('div');
  const range = document.createRange();
  const template = `
    <div class="board" style="height: ${this.tileWidth * this.rows}px; width: ${this.tileWidth * this.columns}px;"></div>
    <p class="message"></p>
  `;
  const frag = range.createContextualFragment(template);
  const board = frag.querySelector('.board');

  board.addEventListener('click', this.clickHandler);
  this.element.classList.add('board-container');
  this.tiles.forEach((tile) => board.appendChild(tile.element));
  this.element.appendChild(frag);
}

// From https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
/**
 * Checks if the given tile order is solvable.
 * @param {[number]} tileOrder - An array consisting of shuffled numbers.
 * @param {number} columns - The number of columns the puzzle has.
 * @param {number} rows - The number of rows the puzzle has.
 * @returns {boolean} Boolean value indicating if the shuffled array is solvable or not.
 */
function isSolvable(tileOrder, columns, rows) {
  const blankTileRowNumberFromBottom = rows - Math.floor(tileOrder.indexOf(tileOrder.length) / rows); // "...row counting from the bottom (last, third-last, fifth-last etc)"
  let inversions = 0;

  // "An inversion is when a tile precedes another tile with a lower number on it. The
  // solution state has zero inversions. ...an inversion is a pair of tiles (a, b) such
  // that a appears before b, but a > b"
  tileOrder.forEach((num, i, arr) => {
    if (num < arr.length && i + 1 < arr.length) {
      const succeedingNumbers = arr.slice(i + 1);

      succeedingNumbers.forEach((succeeding) => {
        if (succeeding > 0 && succeeding < num) {
          inversions++;
        }
      })
    }
  });

  // Don't present a solved state.
  if (inversions === 0) {
    return false;
  }

  // "The formula says:
  // a. If the grid width is odd, then the number of inversions in a solvable situation is even.
  if (columns % 2 !== 0) {
    return inversions % 2 === 0;
  }

  // b. If the grid width is even, and the blank is on an even row counting from the bottom
  // (second-last, fourth-last etc), then the number of inversions in a solvable situation is odd.
  if (blankTileRowNumberFromBottom % 2 === 0) {
    return inversions % 2 !== 0;
  }

  // c. If the grid width is even, and the blank is on an odd row counting from the bottom
  // (last, third-last, fifth-last etc) then the number of inversions in a solvable situation is even."
  return inversions % 2 === 0;
}

/**
 * Moves a clicked tile if possible.
 * @param {EventListenerObject} e - The event listener object.
 */
function clickHandler(e) {
  const target = e.target;

  if (target.classList.contains('tile')) {
    const value = parseInt(target.dataset.value, 10);

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

      if (isSolved(this.tiles, this.columns)) {
        const message = this.element.querySelector('.message');
        message.innerText = 'Yazzzzz!';
        message.classList.add('shown');

        const board = this.element.querySelector('.board');
        board.removeEventListener('click', this.clickHandler);
        board.classList.add('solved');
      }
    } else {
      console.log(`Can't move the tile yo.`);
    }
  }
}

/**
 * Checks if the board is solved.
 * @param {[Tile]} tiles - The board's tiles.
 * @param {number} columns - The number of columns the board has.
 * @returns {boolean} Boolean value indicating whether the board is solved or not.
 */
function isSolved(tiles, columns) {
  return !tiles.some((tile, i, arr) => {
    const tileValue = tile.value || arr.length; // Set the blank tile's value as the last item.
    const correctRow = Math.ceil(tileValue / columns) - 1;
    const correctColumn = (tileValue - 1) % columns;
    const isCorrect = tile.row === correctRow && tile.column === correctColumn;

    return !isCorrect;
  });
}

export default class Board {
  constructor(columns = 4, rows = 4, tileWidth = 100) {
    this.columns = columns;
    this.rows = rows;
    this.tileWidth = tileWidth;
    this.tiles = [];
    this.clickHandler = clickHandler.bind(this);
    initBoard.call(this);
  }
}
