/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import Brick from './Brick.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Score from './Score.js';
import Lives from './Lives.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let rightPressed = false;
let leftPressed = false;
const brickRowCount = 4;
const brickColumnCount = 10;
let brickWidth;
const smallBrickWidth = 30;
const bigBrickWidth = 75;
const brickHeight = 20;
const brickPadding = 15;
const brickOffsetTop = 30;
const brickOffsetLeft = 22.5;
const smallBrickColors = ['#0000FF', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF', '#FF1493', '#00FFFF', '#00FF00'];
const bigBrickColors = ['#0000FF', '#FFFF00', '#0000FF', '#8B00FF', '#00FFFF'];
const paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10);
const ball = new Ball(canvas.width / 2, canvas.height - 30);
const score = new Score(8, 20);
const lives = new Lives(canvas.width - 65, 20);

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = new Brick(0, 0);
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === true) {
        if (
          ball.x > b.x
          && ball.x < b.x + b.width
          && ball.y > b.y
          && ball.y < b.y + b.height
        ) {
          ball.dy *= -1;
          b.status = 0;
          score.update(1);
          if (score.score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBricks() {
  let fillStyle;
  for (let r = 0; r < brickRowCount; r += 1) {
    // Determine the brickColumnCount for the current row
    const currentBrickColumnCount = r % 2 === 0 ? 10 : 5;
    for (let c = 0; c < currentBrickColumnCount; c += 1) {
      if (bricks[c][r].status === true) {
        if (r % 2 === 0) {
          brickWidth = smallBrickWidth;
          fillStyle = smallBrickColors;
        } else {
          brickWidth = bigBrickWidth;
          fillStyle = bigBrickColors;
        }
        bricks[c][r].x = c * (brickWidth + brickPadding) + brickOffsetLeft;
        bricks[c][r].y = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].width = brickWidth;
        bricks[c][r].height = brickHeight;
        bricks[c][r].color = fillStyle[c];
        bricks[c][r].render(ctx);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ball.render(ctx);
  paddle.render(ctx);
  score.render(ctx);
  lives.render(ctx);
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx *= -1;
  }

  if (ball.y + ball.dy < ball.radius) {
    ball.dy *= -1;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy *= -1;
    } else {
      lives.loseLife();
      if (lives.lives === 0) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 2;
        ball.dy = -2;
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
}

draw();
