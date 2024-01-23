import Sprite from './Sprite.js';

class Lives extends Sprite {
  constructor(x, y, color = '#0095DD', lives = 3, font = '16px Arial') {
    super(x, y, 0, 0, color);
    this.lives = lives;
    this.font = font;
  }

  loseLife() {
    this.lives -= 1;
  }

  reset() {
    this.lives = 3;
  }
}

export default Lives;
