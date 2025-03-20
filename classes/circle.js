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

    const particles_inside = this.particles.filter((particle) => {
      const x = particle.position.x;
      const y = particle.position.y;
      const inside = ( (cx - x) ** 2 + (cy - y) ** 2 ) < ( r ** 2 );
      return inside;
    });

    const particles_updateable = particles_inside.filter((particle) => {
      return !particle.isUpdating;
    })
    return {inside: particles_inside, updateable: particles_updateable}
  }
  update(updateWrapper, callbackFunc) {
    const {inside, updateable} = this.getParticles();

    let newUpdateWrapper;
    if (typeof updateWrapper === 'function') {
      newUpdateWrapper = (runUpdate) => {
        updateWrapper(runUpdate, updateable.length ** 2);
      }
    }
    const runUpdate = () => {
      for (let particle of updateable) {
        const force = particle.getForce(this.particles);
        particle.update(force, newUpdateWrapper);
      }
      callbackFunc();
    }
    runUpdate();
  }
}

export default Circle;