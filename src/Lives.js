/* eslint-disable import/extensions */
import Sprite from './Sprite.js';

class Lives extends Sprite {
  constructor(x, y, color = '#0095DD', lives = 3, font = '16px Arial') {
    super(x, y, 0, 0, color);
    this.lives = lives;
    this.font = font;
  }

  render(ctx) {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${this.lives}`, this.x, this.y);
  }

  loseLife() {
    this.lives -= 1;
  }

  reset() {
    this.lives = 3;
  }
}

export default Lives;
