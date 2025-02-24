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
  }

  getParticles() {
    const particles = this.particles;
    const insideParticles = particles.filter((particle) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const isInX =  x >= this.x && x < (this.x + this.width);
      const isInY =  y >= this.y && y < (this.y + this.width);
      return isInX && isInY;
    });
    return insideParticles;
  }

  update() {
    this.elem.classList.add('updating');
    const particles = this.getParticles();
    for (let particle of particles) {
      const force = particle.getForce(this.particles);
      particle.update(force);
    }
    window.requestAnimationFrame(() => {
      this.elem.classList.remove('updating');
    })
  }
}

export default Square;