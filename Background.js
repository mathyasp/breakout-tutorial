import Sprite from './Sprite.js';

class Background extends Sprite {
  constructor(color, image) {
    super(color);
    this.image = image;
  }
}

export default Background;
