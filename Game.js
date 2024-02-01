/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import Brick from './Brick.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Score from './Score.js';
import Lives from './Lives.js';

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ball = new Ball(this.width / 2, this.height - 30);
    this.score = new Score(8, 20);
    this.lives = new Lives(this.width - 65, 20);
    this.paddle = new Paddle((this.width - 75) / 2, this.height - 10);
    this.rightPressed = false;
    this.leftPressed = false;
    this.brickRowCount = 4;
    this.brickColumnCount = 10;
    this.brickWidth = 0;
    this.smallBrickWidth = 30;
    this.bigBrickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 15;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 22.5;
    this.bricks = [];
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r += 1) {
        this.bricks[c][r] = new Brick(0, 0);
      }
    }
    this.smallBrickColors = ['#0000FF', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF', '#FF1493', '#00FFFF', '#00FF00'];
    this.bigBrickColors = ['#0000FF', '#FFFF00', '#0000FF', '#8B00FF', '#00FFFF'];
    this.draw = this.draw.bind(this);
  }

  drawBricks() {
    let fillStyle;
    for (let r = 0; r < this.brickRowCount; r += 1) {
      // Determine the brickColumnCount for the current row
      const currentBrickColumnCount = r % 2 === 0 ? 10 : 5;
      for (let c = 0; c < currentBrickColumnCount; c += 1) {
        if (this.bricks[c][r].status === true) {
          if (r % 2 === 0) {
            this.brickWidth = this.smallBrickWidth;
            fillStyle = this.smallBrickColors;
          } else {
            this.brickWidth = this.bigBrickWidth;
            fillStyle = this.bigBrickColors;
          }
          this.bricks[c][r].x = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          this.bricks[c][r].y = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[c][r].width = this.brickWidth;
          this.bricks[c][r].height = this.brickHeight;
          this.bricks[c][r].color = fillStyle[c];
          this.bricks[c][r].render(this.ctx);
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.width) {
      this.paddle.x = relativeX - this.paddle.width / 2;
    }
  }

  listeners() {
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    document.addEventListener('keydown', this.keyDownHandler, false);
    document.addEventListener('keyup', this.keyUpHandler, false);
    document.addEventListener('mousemove', this.mouseMoveHandler, false);
  }

  playAgain(winOrLose) {
    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'absolute';
    gameContainer.style.top = '0';
    gameContainer.style.left = `${this.canvas.offsetLeft}px`;
    gameContainer.style.width = `${this.width}px`;
    gameContainer.style.height = `${this.height}px`;
    gameContainer.style.backgroundColor = 'white';
    gameContainer.style.display = 'flex';
    gameContainer.style.justifyContent = 'center';
    gameContainer.style.alignItems = 'center';

    let message = '';

    if (winOrLose === 'win') {
      message = 'Congratulations! You won!';
    } else {
      message = 'Game over!';
    }

    const playAgainHTML = `
      <div style="background-color: white; padding: 20px;">
        <h2>${message}</h2>
        <p>Do you want to play again?</p>
        <button onclick="window.location.reload()">Yes</button>
        <button onclick="alert('Thank you for playing!')">No</button>
      </div>
    `;

    gameContainer.innerHTML = playAgainHTML;
    document.body.appendChild(gameContainer);
  }

  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c += 1) {
      for (let r = 0; r < this.brickRowCount; r += 1) {
        const b = this.bricks[c][r];
        if (b.status === true) {
          if (
            this.ball.x > b.x
            && this.ball.x < b.x + b.width
            && this.ball.y > b.y
            && this.ball.y < b.y + b.height
          ) {
            this.ball.dy *= -1;
            b.status = 0;
            this.score.update(1);
            if (this.score.score === this.brickRowCount * this.brickColumnCount) {
              this.playAgain('win');
            }
          }
        }
      }
    }
  }

  draw() {
    this.listeners();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBricks();
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.score.render(this.ctx);
    this.lives.render(this.ctx);
    this.collisionDetection();

    if (
      this.ball.x + this.ball.dx > this.width - this.ball.radius
      || this.ball.x + this.ball.dx < this.ball.radius
    ) {
      this.ball.dx *= -1;
    }

    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy *= -1;
    } else if (this.ball.y + this.ball.dy > this.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy *= -1;
      } else {
        this.lives.loseLife();
        if (this.lives.lives === 0) {
          this.playAgain('lose');
        } else {
          this.ball.x = this.width / 2;
          this.ball.y = this.height - 30;
          this.ball.dx = 2;
          this.ball.dy = -2;
          this.paddle.x = (this.width - this.paddle.width) / 2;
        }
      }
    }

    if (this.rightPressed && this.paddle.x < this.width - this.paddle.width) {
      this.paddle.x += 7;
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= 7;
    }

    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    requestAnimationFrame(this.draw);
  }
}

export default Game;
