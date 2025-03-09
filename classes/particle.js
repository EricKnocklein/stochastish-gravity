const attractionStrength = .005;
const repulsionStrength = 0;

const equilibriumDistance = 100;
const K = .00001;

const DAMP = 0.995;
const TEMP = 0.1;

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

    this.velocity.x *= DAMP;
    this.velocity.y *= DAMP;

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
      this.isUpdating = false;
    }
    if (typeof updateWrapper === 'function') {
      updateWrapper(runUpdate, particles);
    } else {
      runUpdate();
    }
  }

  getForce(particles) {
    let forceX = 0;
    let forceY = 0;

    for (let other of particles) {
      if (other === this) continue;

      let dx = other.position.x - this.position.x;
      let dy = other.position.y - this.position.y;
      let distSq = dx * dx + dy * dy;

      if (distSq < 10) continue;

      let dist = Math.sqrt(distSq);

      let forceMagnitude = K * (dist - equilibriumDistance);
      forceMagnitude += attractionStrength * (1 / distSq) - repulsionStrength * (1 / dist ** 3);


      let fx = (forceMagnitude / dist) * dx;
      let fy = (forceMagnitude / dist) * dy;

      forceX += fx;
      forceY += fy;
    }

    return { x: forceX, y: forceY };
  }
}

export default Particle;
