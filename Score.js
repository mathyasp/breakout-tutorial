import Sprite from './Sprite';

class Score extends Sprite {
  constructor(x, y, color = '#0095DD', score = 0, font = '16px Arial') {
    super(x, y, 0, 0, color);
    this.score = score;
    this.font = font;
  }

  update(points) {
    this.score += points;
  }

  reset() {
    this.score = 0;
  }
}

export default Score;
