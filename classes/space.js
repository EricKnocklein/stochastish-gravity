import Particle from "./particle";
import Square from "./square";

class Space {
  constructor(width, height, squareSelector) {
    this.squareSelector = squareSelector;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.squares = [];
    for (let x = 0; x < width; x++) {
      this.squares[x] = [];
      for (let y = 0; y < height; y++) {
        this.squares[x][y] = new Square(this, { x: x, y: y });
      }
    }
  }

  addParticle(x, y) {
    this.particles.push(
      new Particle({ x: x, y: y }, { x: 0, y: 0 }, this.particles.length)
    );
  }

  update() {
    const { xq, yq } = this.squareSelector();
    const x = Math.floor(xq * this.width);
    const y = Math.floor(yq * this.height);

    const square = this.squares[x][y];
    square.update();
  }
}

export default Space;
