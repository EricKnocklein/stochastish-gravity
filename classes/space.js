import Particle from "./particle.js";
import Square from "./square.js";

class Space {
  constructor(element, width, height, squareSelector, squareWith) {
    this.squareHolder = document.createElement('div');
    this.particleHolder = document.createElement('div');

    element.style.width = `${squareWith * width}px`;
    element.style.height =  `${squareWith * height}px`;

    element.appendChild(this.squareHolder);
    element.appendChild(this.particleHolder);
    this.setupParticleHolder();
    this.setupSquareHolder();

    this.createCenterOfGravity();

    this.squareSelector = squareSelector;
    this.width = width;
    this.height = height;
    this.squareWidth = squareWith;
    this.particles = [];
    this.squares = [];
    for (let i = 0; i < width; i++) {
      this.squares[i] = [];
      for (let j = 0; j < height; j++) {
        const square = new Square(this.particles, { x: i, y: j }, squareWith);
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
    this.updateCenterOfGravity();
  }

  getParticle() {
    let square;
    let count = 20;
    while (!square || count < 0) {
      const selection = this.squareSelector();
      const x = Math.floor(selection.x * this.width);
      const y = Math.floor(selection.y * this.height);

      square = this.squares[x][y];
      if (square.isUpdating) {
        square = null;
      }
      count--;
    }
    return square;
  }

  update(updateFunc) {

    const square = this.getParticle();
    if (!square) {
      return;
    }


    const sqW = this.squareWidth;

    const callback = () => {
      for (const particle of this.particles) {
        const pos = particle.position;
        let hitWall = false;

        if (pos.x < sqW / 2) {
          pos.x = sqW / 2;
          hitWall = true;
        } else if (pos.x > (this.width * sqW) - (sqW / 2)) {
          pos.x = (this.width * sqW) - sqW / 2;
          hitWall = true;
        }

        if (pos.y < sqW / 2) {
          pos.y = sqW / 2;
          hitWall = true;
        } else if (pos.y >= (this.height * sqW) - (sqW / 2)) {
          pos.y = (this.height * sqW) - sqW / 2;
          hitWall = true;
        }

        if (hitWall) {
          particle.velocity.x = 0;
          particle.velocity.y = 0;
          particle.updateElemPosition();
        }
      }
      this.updateCenterOfGravity();
    }

    square.update(updateFunc, callback);
  }

  createCenterOfGravity() {
    this.center = document.createElement('div');
    this.center.classList.add('particle', 'centerOfGravity');

    this.particleHolder.appendChild(this.center);
  }

  updateCenterOfGravity() {
    const xTotal = this.particles.reduce((acc, cur) => {
      return acc + cur.position.x;
    }, 0);
    const yTotal = this.particles.reduce((acc, cur) => {
      return acc + cur.position.y;
    }, 0);

    const x = xTotal / this.particles.length;
    const y = yTotal / this.particles.length;

    this.center.style.setProperty('--x', x);
    this.center.style.setProperty('--y', y);
  }
}

export default Space;
