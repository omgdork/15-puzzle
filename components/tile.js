export default class Tile {
  constructor({ value, row, column, width, clickHandler }) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.width = width;
    this.clickHandler = (value) => clickHandler(value);
    this.generateTileElement();
  }

  /**
   * Generates the tile element.
   */
  generateTileElement() {
    this.element = document.createElement('div');
    this.element.classList.add('tile');
    
    if (this.value === 0) {
      this.element.classList.add('null');
    } else {
      this.element.innerText = this.value;
    }

    // Make the tile square.
    const tileWidth = `calc(${this.width}vmin - 10px)`; // 10px is for the margin (5px on either side)
    this.element.style = `
      height: ${tileWidth};
      line-height: ${tileWidth};
      width: ${tileWidth};
    `;

    this.element.addEventListener('click', () => this.clickHandler(this.value));
    this.move();
  }

  /**
   * Moves the tile element to its latest coordinates.
   */
  move() {
    this.element.style.top = `calc(${this.row * this.width}vmin + 5px)`;
    this.element.style.left = `calc(${this.column * this.width}vmin + 5px)`;
  }
}