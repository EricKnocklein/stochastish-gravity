class Square {
  constructor(particles, indeces, width) {
    this.particles = particles;
    this.x = indeces.x * width;
    this.y = indeces.y * width;
    this.width = width;
    this.createElement(`${this.x}_${this.y}`);
  }

  createElement(id) {
    const elem = document.createElement("div");
    elem.id = `square_${id}`;
    elem.classList.add("square");
    elem.style.setProperty('--x', this.x);
    elem.style.setProperty('--y', this.y);
    elem.style.setProperty('--width', this.width);
    this.elem = elem;

    return elem;
  }

  getParticles() {
    const particles = this.particles;
    return particles.filter((particle) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const isInX =  x >= this.x && x < (this.x + this.width);
      const isInY =  x >= this.y && y < (this.y + this.width);
      return isInX && isInY;
    })
  }

  update() {
    const particles = this.getParticles();
    for (let particle of particles) {
      const force = particle.getForce(this.particles);
      particle.update(force);
    }
  }
}

export default Square;