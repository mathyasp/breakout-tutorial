import Sprite from './Sprite';

class Score extends Sprite {
  score: number;
  font: string;

  constructor(x: number, y: number, color = '#0095DD', score = 0, font = '16px Arial') {
    super(x, y, 0, 0, color);
    this.score = score;
    this.font = font;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, this.x, this.y);
  }

  update(points: number) {
    this.score += points;
  }

  reset() {
    this.score = 0;
  }
}

export default Score;
