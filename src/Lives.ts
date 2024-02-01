import Sprite from './Sprite';

class Lives extends Sprite {
  lives: number;
  font: string;

  constructor(x: number, y: number, color = '#0095DD', lives = 3, font = '16px Arial') {
    super(x, y, 0, 0, color);
    this.lives = lives;
    this.font = font;
  }

  render(ctx: CanvasRenderingContext2D) {
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
