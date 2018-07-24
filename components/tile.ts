export default class Tile {
  value: number;
  row: number;
  column: number;
  width: number;
  element: HTMLDivElement;

  constructor(value: number, row: number, column: number, width: number) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.width = width;
    this.generateTileElement();
  }

  /**
   * Moves the tile element to its latest coordinates.
   */
  move() {
    this.element.style.transform = `translate(calc(${this.column *
      this.width}px + 5px), calc(${this.row * this.width}px + 5px))`;
  }

  /**
   * Generates the tile element.
   */
  private generateTileElement() {
    this.element = document.createElement('div');
    this.element.dataset.value = this.value.toString();
    this.element.classList.add('tile');

    if (this.value === 0) {
      this.element.classList.add('null');
    } else {
      this.element.innerText = this.value.toString();
    }

    // Make the tile square.
    const tileWidth: string = `calc(${this.width}px - 10px)`; // 10px is for the margin (5px on either side).
    this.element.style.height = tileWidth;
    this.element.style.lineHeight = tileWidth;
    this.element.style.width = tileWidth;

    this.move();
  }
}
