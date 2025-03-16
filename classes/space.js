import Particle from "./particle.js";
import Square from "./square.js";
import Circle from "./circle.js";

class Space {
  constructor(element, width, height, extraOptions) {

    const squareWidth = extraOptions?.squareWidth ?? 10;
    let selectorFunction = extraOptions?.selectorFunction;
    let radiusSelectorFunction = extraOptions?.radiusSelectorFunction;
    
    if (!selectorFunction) {
      selectorFunction = () => {
        return { x: Math.random(), y: Math.random() };
      }
    }
    if (!radiusSelectorFunction) {
      radiusSelectorFunction = () => {
        return Math.random() * 5 * squareWidth;
      }
    }
    
    this.squareHolder = document.createElement('div');
    this.particleHolder = document.createElement('div');

    element.style.width = `${squareWidth * width}px`;
    element.style.height =  `${squareWidth * height}px`;

    element.appendChild(this.squareHolder);
    element.appendChild(this.particleHolder);
    this.setupParticleHolder();
    this.setupSquareHolder();

    this.createCenterOfGravity();

    this.selectorFunction = selectorFunction;
    this.radiusSelectorFunction = radiusSelectorFunction;

    this.width = width;
    this.height = height;
    this.squareWidth = squareWidth;
    this.particles = [];
    this.squares = [];
    for (let i = 0; i < width; i++) {
      this.squares[i] = [];
      for (let j = 0; j < height; j++) {
        const square = new Square(this.particles, { x: i, y: j }, squareWidth);
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

  getSquare() {
    let square;
    let count = 20;
    while (!square || count < 0) {
      const selection = this.selectorFunction();
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
    const square = this.getSquare();
    if (!square) {
      return;
    }

    const callback = () => {
      this.postUpdateNormalize();
    }

    square.update(updateFunc, callback);
  }

  updateCircle(updateFunc) {
    if (!this.cirlce) {
      this.cirlce = new Circle(
        this.particles, 
      );
    }

    const callback = () => {
      this.postUpdateNormalize();
    }

    const selection = this.selectorFunction();
    const sqW = this.squareWidth;
    const x = Math.floor(selection.x * this.width * sqW);
    const y = Math.floor(selection.y * this.height * sqW);

    const r = this.radiusSelectorFunction()

    this.cirlce.setPositionAndRadius(x, y, r);
    this.cirlce.update(updateFunc, callback);
  }

  postUpdateNormalize() {
    const sqW = this.squareWidth;
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
