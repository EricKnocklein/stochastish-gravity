import Space from "./classes/space.js";

const gradientSim = document.getElementById('gradient');

const gradientSelector = () => {
  const x = 1 - Math.random() ** 2;
  // const x = Math.random();
  const y = Math.random();

  return {x: x, y: y};
}

const space = new Space(gradientSim, 60, 30, gradientSelector, 10);

for (let i = 0; i < 30; i++) {
  for (let j = 0; j < 14; j++) {
    const x = (i * 10) + 150;
    const y = (j * 10) + 80;
    space.addParticle(x, y);
  }
}

window.particles = space.particles;

let runSim = false;
const runner = () => {
  if (!runSim) {
    return;
  }
  for (let i = 0; i < 50; i++) {
    space.update();
  }
  window.requestAnimationFrame(() => {
    runner();
  })
}

gradientSim.addEventListener('click', () => {
  runSim = !runSim;
  runner();
})