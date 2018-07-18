export default class Tile {
  constructor({ value, row, column, width }) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.width = width;
    generateTileElement.call(this);
  }

  /**
   * Moves the tile element to its latest coordinates.
   */
  move() {
    this.element.style.transform = `translate(calc(${this.column * this.width}px + 5px), calc(${this.row * this.width}px + 5px))`;
  }
}

/**
 * Generates the tile element.
 */
function generateTileElement() {
  this.element = document.createElement('div');
  this.element.dataset.value = this.value;
  this.element.classList.add('tile');
  
  if (this.value === 0) {
    this.element.classList.add('null');
  } else {
    this.element.innerText = this.value;
  }

  // Make the tile square.
  const tileWidth = `calc(${this.width}px - 10px)`; // 10px is for the margin (5px on either side)
  this.element.style = `
    height: ${tileWidth};
    line-height: ${tileWidth};
    width: ${tileWidth};
  `;

  this.move();
}
