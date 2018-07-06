export default class Tile {
  constructor({ value, row, column, width, clickHandler }) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.width = width;
    this.clickHandler = clickHandler;
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
    const tileWidth = `calc(${this.width}px - 10px)`; // 10px is for the margin (5px on either side)
    this.element.style = `
      height: ${tileWidth};
      line-height: ${tileWidth};
      width: ${tileWidth};
    `;

    this.element.addEventListener('click', this);
    this.move();
  }

  /**
   * Moves the tile element to its latest coordinates.
   */
  move() {
    this.element.style.top = `calc(${this.row * this.width}px + 5px)`;
    this.element.style.left = `calc(${this.column * this.width}px + 5px)`;
  }

  disable() {
    this.element.removeEventListener('click', this);
    this.element.classList.add('disabled');
  }

  handleEvent(e) {
    switch (e.type) {
      case 'click':
        this.clickHandler(this.value);
        break;
      default:
        // Do nothing.
    }
  }
}