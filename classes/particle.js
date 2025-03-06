const attractionStrength = 25;
const repulsionStrength = 0;

const equilibriumDistance = 150;
const K = .00001;

const DAMP = 0.995;
const TEMP = .02;

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

  update(force) {
    this.updateParticlePosition();
    const acc = {
      x: force.x / this.mass,
      y: force.y / this.mass,
    };
    this.updateParticleVelocity(acc);
    this.updateParticlePosition();
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


      let fx = (forceMagnitude / dist) * dx;
      let fy = (forceMagnitude / dist) * dy;

      forceX += fx;
      forceY += fy;
    }

    return { x: forceX, y: forceY };
  }
}

export default Particle;
