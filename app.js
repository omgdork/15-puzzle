'use strict';

import Board from './components/board.js';

const container = document.querySelector('.container');
const txtBoardSize = document.getElementById('txt-board-size');
const txtTileSize = document.getElementById('txt-tile-size');
const btnAdd = document.getElementById('btn-add');

btnAdd.addEventListener('click', () => {
  const boardSize = parseInt(txtBoardSize.value, 10);
  const tileSize = parseInt(txtTileSize.value, 10);
  const newBoard = new Board(isNaN(boardSize) ? 4 : boardSize, isNaN(tileSize) ? 20 : tileSize);

  container.appendChild(newBoard.element);
});
