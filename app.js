'use strict';

import Utilities from './utilities/utilities.js';
import Board from './components/board.js';

(() => {
  function init() {
    const container = document.querySelector('.app');
    const txtColumns = document.getElementById('txt-columns');
    const txtRows = document.getElementById('txt-rows');
    const txtTileSize = document.getElementById('txt-tile-size');
    const btnAdd = document.getElementById('btn-add');

    btnAdd.addEventListener('click', () => {
      const columns = parseInt(txtColumns.value || 4, 10);
      const rows = parseInt(txtRows.value || 4, 10);
      const tileSize = parseInt(txtTileSize.value || 100, 10);
      const newBoard = new Board(columns, rows, tileSize);

      container.appendChild(newBoard.element);
      newBoard.element.focus();
    });
  }

  Utilities.ready(init);
})();
