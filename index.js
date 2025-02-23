import Space from "./classes/space.js";

const gradientSim = document.getElementById('gradient');

const gradientSelector = () => {
  const x = Math.random() ** 2;
  const y = Math.random();

  return {x: x, y: y};
}

const space = new Space(gradientSim, 55, 30, gradientSelector);

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    const x = (i * 100) + 50;
    const y = (j * 50) + 50;
    space.addParticle(x, y);
  }
}