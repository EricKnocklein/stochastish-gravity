class Particle {
  constructor(pos, v, id, interactions) {
    this.position = { x: pos.x, y: pos.y };
    this.velocity = {x: v.x, y: v.y};
    this.interactions = interactions;
    this.createElement(id);
  }

  createElement(id) {
    this.elem = document.createElement('div');
    this.elem.id = `particle_${id}`;
    this.elem.classList.add('particle');
    this.updateElemPosition();
    return elem;
  }

  updateElemPosition() {
    this.elem.style.setProperty('--x', this.pos.x);
    this.elem.style.setProperty('--y', this.pos.y);
  }
}
