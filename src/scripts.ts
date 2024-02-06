import Game from './Game';

const newCanvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;

const game = new Game(newCanvas);
game.draw();
