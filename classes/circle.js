class Circle {
  constructor(particles) {
    this.particles = particles;
    this.x = 0;
    this.y = 0;
    this.r = 1;
  }
  setPositionAndRadius(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  getParticles() {
    const cy = this.y;
    const cx = this.x;
    const r = this.r;

    return this.particles.filter((particle) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const inside = ( (cx - x) ** 2 + (cy - y) ** 2 ) < ( r ** 2 );
      const canUpdate = !particle.isUpdating;
      return canUpdate && inside;
    })
  }
  update(updateWrapper, callbackFunc) {
    const particles = this.getParticles();

    let newUpdateWrapper;
    if (typeof updateWrapper === 'function') {
      newUpdateWrapper = (runUpdate) => {
        updateWrapper(runUpdate, particles);
      }
    }
    const runUpdate = () => {
      for (let particle of particles) {
        const force = particle.getForce(this.particles);
        particle.update(force, newUpdateWrapper);
      }
      callbackFunc();
    }
    runUpdate();
  }
}

export default Circle;