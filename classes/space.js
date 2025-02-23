import Particle from "./particle.js";
import Square from "./square.js";

class Space {
  constructor(element, width, height, squareSelector) {
    this.squareHolder = document.createElement('div');
    this.particleHolder = document.createElement('div');

    element.style.width = `${Square.SQUARE_WIDTH * width}px`;
    element.style.height =  `${Square.SQUARE_WIDTH * height}px`;

    element.appendChild(this.squareHolder);
    element.appendChild(this.particleHolder);
    this.setupParticleHolder();
    this.setupSquareHolder();

    this.squareSelector = squareSelector;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.squares = [];
    for (let i = 0; i < width; i++) {
      this.squares[i] = [];
      for (let j = 0; j < height; j++) {
        const square = new Square(this.particles, { x: i, y: j });
        this.squareHolder.appendChild(square.elem);
        this.squares[i][j] = square;
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
