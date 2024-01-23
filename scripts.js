/* eslint-disable no-alert */
import Brick from './Brick.js';
import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Score from './Score.js';
import Lives from './Lives.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
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
    paddleX = relativeX - paddleWidth / 2;
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
          && ball.x < b.x + brickWidth
          && ball.y > b.y
          && ball.y < b.y + brickHeight
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

function drawPaddle() {
  const paddle = new Paddle(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  paddle.render(ctx);
}

function drawBricks() {
  const smallBrickColors = ['#0000FF', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF', '#FF1493', '#00FFFF', '#00FF00'];
  const bigBrickColors = ['#0000FF', '#FFFF00', '#0000FF', '#8B00FF', '#00FFFF'];
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
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        const brick = new Brick(brickX, brickY, brickWidth, brickHeight, fillStyle[c]);
        brick.render(ctx);
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ball.render(ctx);
  drawPaddle();
  score.render(ctx);
  lives.render(ctx);
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx *= -1;
  }

  if (ball.y + ball.dy < ball.radius) {
    ball.dy *= -1;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
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
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
  console.log(canvas.width, canvas.height);
}

draw();
