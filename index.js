import Space from "./classes/space.js";
import Grapher from "./classes/grapher.js";

const biases = {
  noBias: () => {
    return Math.random();
  },
  lowBias: () => {
    return Math.random() ** 2;
  },
  highBias: () => {
    return 1 - Math.random() ** 2;
  },
  midBias: () => {
    return (Math.random() + Math.random()) / 2;
  },
  outBias: () => {
    let x = Math.random();
    return x < 0.5 ? x * x * 2 : 1 - (1 - x) * (1 - x) * 2;
  }
}

const gradientSelector = () => {
  const x = biases['noBias']();
  const y = biases['noBias']();

  return { x: x, y: y };
};

const setUpGradientSim = () => {
  const gradientSim = document.getElementById("gradient");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  }
  const space = new Space(gradientSim, 24, 12, extraOptions);

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
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

  const grapher = new Grapher('gradientChart');

  let runSim = false;
  const runner = () => {
    if (!runSim) {
      return;
    }
    for (let i = 0; i < 150; i++) {
      space.update();
    }
    // space.centerParticles();
    const stats = space.calculateStatsForParticles();
    grapher.addPoint({
      x: stats.t,
      y: stats.xStats.stdDev
    })
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

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
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
    // space.centerParticles();
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

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
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
    // space.centerParticles();
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
