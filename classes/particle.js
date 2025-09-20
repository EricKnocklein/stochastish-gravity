import Force from "./force.js";

function getRandomBetweenMinusOneAndOne() {
  let num;
  do {
    num = Math.random() * 2 - 1; // Generates between -1 and 1
  } while (num === -1 || num === 1); // Excludes -1 and 1
  return num;
}
class Particle {
  constructor(pos, v, id) {
    this.position = { x: pos.x, y: pos.y };
    this.velocity = { x: v.x, y: v.y };
    this.mass = 1;
    this.createElement(id);
    this.updateLog = null;
  }

  set isUpdating(newVal) {
    this._isUpdating = newVal;
    if (newVal) {
      this.elem.classList.toggle('updating');
    } else {
      window.requestAnimationFrame(() => {
        this.elem.classList.remove('updating');
      });
    }
  }

  get isUpdating() {
    return this._isUpdating;
  }

  createElement(id) {
    this.elem = document.createElement("div");
    this.elem.id = `particle_${id}`;
    this.elem.classList.add("particle");
    this.updateElemPosition();
  }

  updateElemPosition() {
    this.elem.style.setProperty("--x", this.position.x);
    this.elem.style.setProperty("--y", this.position.y);
  }

  updateParticlePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.updateElemPosition();
  }

  updateParticleVelocity(acceleration) {
    this.velocity.x += acceleration.x;
    this.velocity.y += acceleration.y;

    this.velocity.x *= Force.dampening;
    this.velocity.y *= Force.dampening;

    this.velocity.x += getRandomBetweenMinusOneAndOne() * Force.extraTemperature;
    this.velocity.y += getRandomBetweenMinusOneAndOne() * Force.extraTemperature;
  }

  update(force, updateWrapper) {
    this.isUpdating = true;
    const runUpdate = () => {
      // this.updateParticlePosition();
      const acceleration = {
        x: force.x / this.mass,
        y: force.y / this.mass,
      };
      this.updateParticleVelocity(acceleration);
      this.updateParticlePosition();
      this.updateLog?.();
      this.isUpdating = false;
    }
    if (typeof updateWrapper === 'function') {
      updateWrapper(runUpdate);
    } else {
      runUpdate();
    }
  }

  getForce(particles) {
    let forceX = 0;
    let forceY = 0;

    for (let other of particles) {
      if (other === this) continue; // j !== i

      // Calculate distance components
      const thisPosition = this.position;
      const otherPosition = other.position;
      let dx = otherPosition.x - thisPosition.x;
      let dy = otherPosition.y - thisPosition.y;

      let distSq = dx * dx + dy * dy;
      if (distSq < 1) { // Prevent singularity and extreme forces
        distSq = 1;
      }

      let dist = Math.sqrt(distSq); // Distance between particles (x^2 + y^2 = r^2)
      let forceMagnitude = Force.calculateForceMagnitude(dist);

      // Convert magnitude and direction to x and y components
      let fx = (forceMagnitude / dist) * dx;
      let fy = (forceMagnitude / dist) * dy;

      // Accumulate forces
      forceX += fx;
      forceY += fy;
    }

    return { x: forceX, y: forceY };
  }
}

export default Particle;
