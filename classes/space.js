import Particle from "./particle";
import Square from "./square";

class Space {
  constructor(element, width, height, squareSelector) {
    this.squareHolder = document.createElement('div');
    this.particleHolder = document.createElement('div');

    element.appendChild(this.squareHolder);
    element.appendChild(this.particleHolder);

    this.squareSelector = squareSelector;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.squares = [];
    for (let x = 0; x < width; x++) {
      this.squares[x] = [];
      for (let y = 0; y < height; y++) {
        const square = new Square(this.particles, { x: x, y: y });
        this.squareHolder.appendChild(square.elem);
        this.squares[x][y] = square
      }
    }
  }

  setupParticleHolder() {
    const elem = this.particleHolder;
    elem.classList.add('particle_holder');
  }

  setupSquareHolder() {
    const elem = this.squareHolder;
    elem.classList.add('square_holder');
  }

  addParticle(x, y) {
    const particle = new Particle(
      { x: x, y: y },
      { x: 0, y: 0 },
      this.particles.length
    );
    this.particles.push(particle);
    this.particleHolder.appendChild(particle.elem)
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
