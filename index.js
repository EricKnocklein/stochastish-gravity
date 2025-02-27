import Space from "./classes/space.js";

const gradientSim = document.getElementById('gradient');

const noBias = () => {
  return Math.random();
}
const lowBias = () => {
  return Math.random() ** 2;
}
const highBias = () => {
  return 1 - Math.random() ** 2;
}
const midBias = () => {
  return (Math.random() + Math.random()) / 2;
}
const outBias = () => {
  let x = Math.random();
  return x < 0.5 ? x * x * 2 : 1 - ((1 - x) * (1 - x) * 2);
}


const gradientSelector = () => {
  const x = highBias();
  const y = outBias();

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

const originalCneter = space.center.cloneNode();
originalCneter.classList.add('original');
space.particleHolder.appendChild(originalCneter);
window.particles = space.particles;

let runSim = false;
const runner = () => {
  if (!runSim) {
    return;
  }
  for (let i = 0; i < 150; i++) {
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