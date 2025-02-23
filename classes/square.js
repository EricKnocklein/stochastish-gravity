class Square {
  constructor(particles, pos) {
    this.particles = particles;
    this.x = pos.x;
    this.y = pos.y;
    this.createElement(`${this.x}_${this.y}`);
  }

  createElement(id) {
    const elem = document.createElement("div");
    elem.id = `square_${id}`;
    elem.classList.add("square");
    elem.style.setProperty('--x', this.x);
    elem.style.setProperty('--y', this.y);
    this.elem = elem;

    return elem;
  }

  getParticles() {
    const particles = this.particles;
    return particles.filter((particle) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const isInX =  x >= this.x && x < (this.x + 1);
      const isInY =  x >= this.y && y < (this.y + 1);
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