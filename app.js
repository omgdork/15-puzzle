'use strict';

import Utilities from './utilities/utilities.js';
import Board from './components/board.js';

class App {
  constructor(container, txtColumns, txtRows, txtTileSize, btnAdd) {
    this.container = container;
    this.txtColumns = txtColumns;
    this.txtRows = txtRows;
    this.txtTileSize = txtTileSize;
    this.btnAdd = btnAdd;
  }

  init() {
    this.btnAdd.addEventListener('click', () => {
      const columns = parseInt(this.txtColumns.value || 4, 10);
      const rows = parseInt(this.txtRows.value || 4, 10);
      const tileSize = parseInt(this.txtTileSize.value || 100, 10);
      const newBoard = new Board(columns, rows, tileSize);

      this.container.appendChild(newBoard.element);
      newBoard.element.focus();
    });
  }
}

(() => {
  Utilities.ready(() => {
    const container = document.querySelector('.app');
    const txtColumns = document.getElementById('txt-columns');
    const txtRows = document.getElementById('txt-rows');
    const txtTileSize = document.getElementById('txt-tile-size');
    const btnAdd = document.getElementById('btn-add');
    const app = new App(container, txtColumns, txtRows, txtTileSize, btnAdd);

    app.init();
  });
})();
