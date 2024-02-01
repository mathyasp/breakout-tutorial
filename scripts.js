/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import Game from './Game.js';

const newCanvas = document.getElementById('myCanvas');

const game = new Game(newCanvas);
game.draw();
