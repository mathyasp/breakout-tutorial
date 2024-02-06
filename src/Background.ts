import Sprite from './Sprite';

class Background extends Sprite {
  image: string;

  constructor(image: string, color: number) {
    super(color);
    this.image = image;
  }
}

export default Background;
