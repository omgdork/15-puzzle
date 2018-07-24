import Utilities from '../utilities/utilities';
import Tile from './tile';

export default class Board {
  columns: number;
  rows: number;
  tileWidth: number;
  tiles: Array<Tile>;
  correctTileCount: number;
  element: HTMLDivElement;

  constructor(columns: number = 4, rows: number = 4, tileWidth: number = 100) {
    this.columns = columns;
    this.rows = rows;
    this.tileWidth = tileWidth;
    this.tiles = [];
    this.correctTileCount = 0;
    this.clickHandler = this.clickHandler.bind(this);
    this.arrowPressHandler = this.clickHandler.bind(this);
    this.init();
  }

  private init() {
    const tileCount: number = this.columns * this.rows;
    let currentRow: number = 0;
    let currentColumn: number = 0;
    let tileOrder: Array<number> = Array.from(
      { length: tileCount },
      (value, key) => key + 1,
    );

    this.correctTileCount = tileCount;

    do {
      tileOrder = Utilities.shuffle(tileOrder);
    } while (!Board.isSolvable(tileOrder, this.columns, this.rows));

    this.tiles = tileOrder.map((v, i, arr) => {
      // The highest value is the blank tile.
      const tile: Tile = new Tile(
        v === arr.length ? 0 : v,
        currentRow,
        currentColumn,
        this.tileWidth,
      );

      // Check if the tile is in the correct position. If it's not,
      // decrement the correctTileCount.
      if (!this.isTileInCorrectPosition(tile)) {
        this.correctTileCount--;
      }

      // Set the row and column indices for the next tile.
      if (currentColumn === this.columns - 1) {
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
   * Checks if the tile is in the correct position.
   * @param {Tile} value - The tile.
   * @returns {boolean} Boolean value indicating whether the tile is in the correct position or not.
   */
  private isTileInCorrectPosition(tile: Tile) {
    const correctRow: number = Math.ceil(tile.value / this.columns) - 1;
    const correctColumn: number = (tile.value - 1) % this.columns;

    return tile.row === correctRow && tile.column === correctColumn;
  }

  /**
   * Adds a new board to the document body.
   */
  private generateBoard() {
    this.element = document.createElement('div');
    this.element.tabIndex = -1; // So the element can be focused on when clicked.

    const range: Range = document.createRange();
    const template: string = `
      <div class="board" style="height: ${this.tileWidth *
        this.rows}px; width: ${this.tileWidth * this.columns}px;"></div>
      <p class="message"></p>
    `;
    const frag: DocumentFragment = range.createContextualFragment(template);
    const board: HTMLDivElement = frag.querySelector('.board');

    board.addEventListener('click', this.clickHandler);
    this.element.classList.add('board-container');
    this.tiles.forEach(tile => board.appendChild(tile.element));
    this.element.appendChild(frag);
    this.element.addEventListener('keydown', this.arrowPressHandler);
  }

  /**
   * Moves a clicked tile if possible.
   * @param {Event} e - The event object.
   */
  private clickHandler(e: Event) {
    const board: HTMLElement = <HTMLElement>e.currentTarget;
    const target: HTMLElement = <HTMLElement>e.target;

    if (board) {
      board.focus();
    }

    if (target.classList.contains('tile')) {
      const value: number = parseInt(target.dataset.value, 10);

      if (!value) {
        return;
      }

      const tile: Tile = this.tiles.find(tile => tile.value === value);
      const blankTile: Tile = this.tiles.find(tile => tile.value === 0);

      if (this.isTileMovable(blankTile, tile)) {
        this.moveTile(blankTile, tile);
      }
    }
  }

  /**
   * Moves a movable tile to the direction specified with an arrow key press.
   * @param {KeyboardEvent} e - The event object.
   */
  private arrowPressHandler(e: KeyboardEvent) {
    const blankTile: Tile = this.tiles.find(tile => tile.value === 0);
    let tileToMove: Tile;

    switch (e.keyCode) {
      case 37: // left
        tileToMove = this.tiles.find(tile => {
          return (
            tile.row === blankTile.row && tile.column === blankTile.column + 1
          );
        });
        break;
      case 38: // up
        tileToMove = this.tiles.find(tile => {
          return (
            tile.row === blankTile.row + 1 && tile.column === blankTile.column
          );
        });
        break;
      case 39: // right
        tileToMove = this.tiles.find(tile => {
          return (
            tile.row === blankTile.row && tile.column === blankTile.column - 1
          );
        });
        break;
      case 40: // down
        tileToMove = this.tiles.find(tile => {
          return (
            tile.row === blankTile.row - 1 && tile.column === blankTile.column
          );
        });
        break;
      default:
    }

    this.moveTile(blankTile, tileToMove);
  }

  /**
   * Checks if the tile is movable.
   * @param {Tile} blankTile - The blank tile.
   * @param {Tile} tile - The tile to move.
   * @returns {boolean} - Boolean value indicating whether the tile is movable or not.
   */
  private isTileMovable(blankTile: Tile, tile: Tile) {
    return (
      (tile.row === blankTile.row && // Same row.
        (tile.column === blankTile.column - 1 || // Blank tile on the right.
          tile.column === blankTile.column + 1)) || // On the left.
      (tile.column === blankTile.column && // Same column.
        (tile.row === blankTile.row - 1 || // On top.
          tile.row === blankTile.row + 1))
    ); // Down below.
  }

  /**
   * Moves the tile.
   * @param {Tile} blankTile - The blank tile.
   * @param {Tile} tile - The tile to move.
   */
  private moveTile(blankTile: Tile, tile: Tile) {
    if (tile) {
      // Check if the selected tile is correctly positioned before moving.
      const isCorrectPositionBeforeMoving: boolean = this.isTileInCorrectPosition(
        tile,
      );

      // Move the selected and blank tiles.
      [tile.row, blankTile.row] = [blankTile.row, tile.row];
      [tile.column, blankTile.column] = [blankTile.column, tile.column];
      tile.move();
      blankTile.move();

      // Update the correct tile count.
      const isCorrectPositionAfterMoving: boolean = this.isTileInCorrectPosition(
        tile,
      );
      if (isCorrectPositionAfterMoving) {
        this.correctTileCount++;
      } else if (
        isCorrectPositionBeforeMoving &&
        !isCorrectPositionAfterMoving
      ) {
        this.correctTileCount--;
      }

      // Check if the board is solved.
      if (this.correctTileCount === this.tiles.length - 1) {
        // Don't bother checking for the blank tile position.
        const message: HTMLParagraphElement = this.element.querySelector(
          '.message',
        );
        message.innerText = 'Yazzzzz!';
        message.classList.add('shown');

        const board: HTMLDivElement = this.element.querySelector('.board');
        board.removeEventListener('click', this.clickHandler);
        this.element.removeEventListener('keydown', this.arrowPressHandler);
        board.classList.add('solved');
      }
    } else {
      console.log(`Can't move the tile yo.`);
    }
  }

  // From https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
  /**
   * Checks if the given tile order is solvable.
   * @param {Array<number>} tileOrder - An array consisting of shuffled numbers.
   * @param {number} columns - The number of columns the puzzle has.
   * @param {number} rows - The number of rows the puzzle has.
   * @return {boolean} Boolean value indicating if the shuffled array is solvable or not.
   */
  static isSolvable(tileOrder: Array<number>, columns: number, rows: number) {
    // "...row counting from the bottom (last, third-last, fifth-last etc)".
    const blankTileRowNumberFromBottom: number =
      rows - Math.floor(tileOrder.indexOf(tileOrder.length) / rows);

    // "An inversion is when a tile precedes another tile with a lower number on it. The
    // solution state has zero inversions. ...an inversion is a pair of tiles (a, b) such
    // that a appears before b, but a > b"
    let inversions: number = 0;
    tileOrder.forEach((num, i, arr) => {
      if (num < arr.length && i + 1 < arr.length) {
        const succeedingNumbers: Array<number> = arr.slice(i + 1);

        succeedingNumbers.forEach(succeeding => {
          if (succeeding > 0 && succeeding < num) {
            inversions++;
          }
        });
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
}
