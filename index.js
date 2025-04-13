import Space from "./classes/space.js";

function calculateStats(particles) {
  function getStats(values) {
    values.sort((a, b) => a - b);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avg = sum / values.length;
    const min = values[0];
    const max = values[values.length - 1];
    const median =
      values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)];
    const variance =
      values.reduce((acc, v) => acc + (v - avg) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return { avg, median, min, max, stdDev };
  }

  const xValues = particles.map((p) => p.position.x);
  const yValues = particles.map((p) => p.position.y);

  return {
    xStats: getStats(xValues),
    yStats: getStats(yValues),
  };
}

const noBias = () => {
  return Math.random();
};
const lowBias = () => {
  return Math.random() ** 2;
};
const highBias = () => {
  return 1 - Math.random() ** 2;
};
const midBias = () => {
  return (Math.random() + Math.random()) / 2;
};
const outBias = () => {
  let x = Math.random();
  return x < 0.5 ? x * x * 2 : 1 - (1 - x) * (1 - x) * 2;
};

const gradientSelector = () => {
  const x = noBias();
  const y = noBias();

  return { x: x, y: y };
};

const setUpGradientSim = () => {
  const gradientSim = document.getElementById("gradient");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  }
  const space = new Space(gradientSim, 24, 12, extraOptions);

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 14; j++) {
      const x = i * 10 + 150;
      const y = j * 10 + 80;
      space.addParticle(x, y);
    }
  }

  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  let runSim = false;
  const runner = () => {
    if (!runSim) {
      return;
    }
    for (let i = 0; i < 150; i++) {
      space.update();
    }
    space.centerParticles();
    window.requestAnimationFrame(() => {
      // runSim = false;
      runner();
    });
  };

  gradientSim.addEventListener("click", () => {
    runSim = !runSim;
    runner();
  });

  window.gParicles = space.particles;
};

setUpGradientSim();

const setUpCirlceSim = () => {
  const circleSim = document.getElementById("circle");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  }
  const space = new Space(circleSim, 24, 12, extraOptions);

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 14; j++) {
      const x = i * 10 + 150;
      const y = j * 10 + 80;
      space.addParticle(x, y);
    }
  }

  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  let runSim = false;
  const runner = () => {
    if (!runSim) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      space.updateCircle();
    }
    space.centerParticles();
    window.requestAnimationFrame(() => {
      // runSim = false;
      runner();
    });
  };

  circleSim.addEventListener("click", () => {
    runSim = !runSim;
    runner();
  });

  window.cParicles = space.particles;
};

setUpCirlceSim();

const setUpComputeSim = () => {
  const computeSim = document.getElementById("compute");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  }
  const space = new Space(computeSim, 24, 12, extraOptions);

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 14; j++) {
      const x = i * 10 + 150;
      const y = j * 10 + 80;
      space.addParticle(x, y);
    }
  }
  
  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  const updateFunc = (runner, wait) => {
    setTimeout(() => {
      runner();
    }, wait);
  };

  let runSim = false;
  const runner = () => {
    if (!runSim) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      space.updateCircle(updateFunc);
    }
    space.centerParticles();
    window.requestAnimationFrame(() => {
      // runSim = false;
      runner();
    });
  };

  computeSim.addEventListener("click", () => {
    runSim = !runSim;
    runner();
  });

  window.compParicles = space.particles;
};

setUpComputeSim();
