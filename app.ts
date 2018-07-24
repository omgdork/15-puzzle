import Utilities from './utilities/utilities';
import Board from './components/board';

class App {
  container: HTMLDivElement;
  txtColumns: HTMLInputElement;
  txtRows: HTMLInputElement;
  txtTileSize: HTMLInputElement;
  btnAdd: HTMLButtonElement;

  constructor(
    container: HTMLDivElement,
    txtColumns: HTMLInputElement,
    txtRows: HTMLInputElement,
    txtTileSize: HTMLInputElement,
    btnAdd: HTMLButtonElement,
  ) {
    this.container = container;
    this.txtColumns = txtColumns;
    this.txtRows = txtRows;
    this.txtTileSize = txtTileSize;
    this.btnAdd = btnAdd;
  }

  init() {
    this.btnAdd.addEventListener('click', () => {
      const columns = parseInt(this.txtColumns.value || '4', 10);
      const rows = parseInt(this.txtRows.value || '4', 10);
      const tileSize = parseInt(this.txtTileSize.value || '100', 10);
      const newBoard = new Board(columns, rows, tileSize);

      this.container.appendChild(newBoard.element);
      newBoard.element.focus();
    });
  }
}

(() => {
  Utilities.ready(() => {
    const container: HTMLDivElement = document.querySelector('.app');
    const txtColumns: HTMLInputElement = <HTMLInputElement>document.getElementById('txt-columns');
    const txtRows: HTMLInputElement = <HTMLInputElement>document.getElementById('txt-rows');
    const txtTileSize: HTMLInputElement = <HTMLInputElement>document.getElementById('txt-tile-size');
    const btnAdd: HTMLButtonElement = <HTMLButtonElement>document.getElementById('btn-add');
    const app: App = new App(container, txtColumns, txtRows, txtTileSize, btnAdd);

    app.init();
  });
})();
