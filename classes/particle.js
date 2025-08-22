import Force from "./force.js";

const attractionStrength = 20;
const repulsionStrength = 20;

const TEMP = 0;

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

  updateParticleVelocity(acc) {
    this.velocity.x += acc.x;
    this.velocity.y += acc.y;

    this.velocity.x *= Force.dampening;
    this.velocity.y *= Force.dampening;

    this.velocity.x += getRandomBetweenMinusOneAndOne() * TEMP;
    this.velocity.y += getRandomBetweenMinusOneAndOne() * TEMP;
  }

  update(force, updateWrapper) {
    this.isUpdating = true;
    const runUpdate = () => {
      this.updateParticlePosition();
      const acc = {
        x: force.x / this.mass,
        y: force.y / this.mass,
      };
      this.updateParticleVelocity(acc);
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
      if (other === this) continue;

      const thisPosition = this.position;
      const otherPosition = other.position;
      let dx = otherPosition.x - thisPosition.x;
      let dy = otherPosition.y - thisPosition.y;

      let distSq = dx * dx + dy * dy;
      if (distSq < 10) {
        distSq = 10;
      }

      let dist = Math.sqrt(distSq);
      let forceMagnitude = Force.calculateForceMagnitude(dist);

      let fx = (forceMagnitude / dist) * dx;
      let fy = (forceMagnitude / dist) * dy;

      forceX += fx;
      forceY += fy;
    }

    return { x: forceX, y: forceY };
  }
}

export default Particle;
