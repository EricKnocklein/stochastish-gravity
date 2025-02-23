class Square {
  constructor(parent, pos) {
    this.space = parent;
    this.x = pos.x;
    this.y = pos.y;
  }

  getParticles() {
    const particles = this.space.particles;
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
      const force = particle.getForce(this.space.particles);
      particle.update(force);
    }
  }
}

export default Square;