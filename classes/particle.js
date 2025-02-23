const attractionStrength = 0.1;
const repulsionStrength = 1.0;
const equilibriumDistance = 20;

class Particle {
  constructor(pos, v, id, interactions) {
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
    return elem;
  }

  updateElemPosition() {
    this.elem.style.setProperty("--x", this.position.x);
    this.elem.style.setProperty("--y", this.position.y);
  }

  updateParticlePosition() {
    this.position.x += this.velocity.y;
    this.position.y += this.velocity.y;
    this.updateElemPosition();
  }

  updateParticleVelocity(acc) {
    this.velocity.x += acc.x;
    this.velocity.y += acc.y;
  }

  takeStep(force) {
    this.updateParticlePosition();
    const acc = force.map((dir) => {
      return dir / this.mass;
    });
    this.updateParticleVelocity(acc);
  }

  getForce(particles) {
    let forceX = 0;
    let forceY = 0;

    for (let other of particles) {
      if (other === this) continue;

      let dx = other.position.x - this.position.x;
      let dy = other.position.y - this.position.y;
      let distSq = dx * dx + dy * dy;

      if (distSq === 0) continue;

      let dist = Math.sqrt(distSq);
      let normalizedDist = dist / equilibriumDistance;

      // Attraction dominates at long range, repulsion dominates at short range
      let forceMagnitude =
        attractionStrength * (normalizedDist - 1) -
        repulsionStrength / (normalizedDist * normalizedDist);

      let fx = (forceMagnitude / dist) * dx;
      let fy = (forceMagnitude / dist) * dy;

      forceX += fx;
      forceY += fy;
    }

    return { x: forceX, y: forceY };
  }
}
