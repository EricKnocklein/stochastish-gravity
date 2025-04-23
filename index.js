import Space from "./classes/space.js";
import Grapher from "./classes/grapher.js";

const SIM_LIMIT = 90000;

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
  },
};

const gradientSelector = () => {
  const x = biases["noBias"]();
  const y = biases["noBias"]();

  return { x: x, y: y };
};

const runner = (args, upf, lim) => {
  const space = args.space;
  const grapher = args.grapher;

  if (!args.runSim || space.numParticlesUpdated > lim) {
    return;
  }

  let updateFunc = args.isCircle
    ? space.updateCircle.bind(space, args.callback)
    : space.update.bind(space, args.callback);
  updateFunc = args.doGlobalUpdate ? space.updateGlobal.bind(space) : updateFunc;
  
  for (let i = 0; i < upf; i++) {
    updateFunc();
  }
  if (args.doCenter) {
    space.centerParticles();
  }
  const stats = space.calculateStatsForParticles();
  const currentDataset = grapher?.chart.data.datasets[0].data;
  const notDup = currentDataset.length < 1 || currentDataset[currentDataset.length - 1].x < stats.t;
  if (notDup && stats.t > 6000) {
    grapher?.addPoint(
      {
        x: stats.t,
        y: (stats.xStats.stdDev + stats.yStats.stdDev) / 2,
      },
      0
    );
    grapher?.addPoint(
      {
        x: stats.t,
        y: ((stats.xStats.max - stats.xStats.min) + (stats.yStats.max - stats.yStats.min)) / 4,
      },
      1
    );
  }
  window.requestAnimationFrame(() => {
    runner(args, upf, lim);
  });
};

const createParticles = (space, xNum, yNum, xSep, ySep) => {
  for (let i = 0; i < xNum; i++) {
    for (let j = 0; j < yNum; j++) {
      const x = i * xSep;
      const y = j * ySep;
      space.addParticle(x, y);
    }
  }
};

const setUpGlobalSim = () => {
  const globalSim = document.getElementById("global");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  };
  const space = new Space(globalSim, 24, 12, extraOptions);

  createParticles(space, 15, 10, 20, 20);

  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  const grapher = new Grapher("globalChart");
  const args = {
    runSim: false,
    space: space,
    grapher: grapher,
    doCenter: false,
    isCircle: false,
    doGlobalUpdate: true,
  };

  const runnerClick = () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 1, SIM_LIMIT);
  }

  globalSim.querySelector('.reset').addEventListener('click', (e) => {
    args.runSim = false;
    globalSim.removeEventListener('click', runnerClick);
    e.stopPropagation()
    space.destroy();
    grapher.destroy();
    setUpGradientSim();
  });

  globalSim.addEventListener("click", runnerClick);

  window.gParicles = space.particles;
}

setUpGlobalSim();

const setUpGradientSim = () => {
  const gradientSim = document.getElementById("gradient");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  };
  const space = new Space(gradientSim, 24, 12, extraOptions);

  const xBiasSelect = document.getElementById('x-bias-select');
  const yBiasSelect = document.getElementById('y-bias-select');

  const onInputChange = () => {
    const xInput = xBiasSelect?.value ?? 'noBias';
    const yInput = yBiasSelect?.value ?? 'noBias';
    space.selectorFunction = () => {
      const x = biases[xInput]();
      const y = biases[yInput]();

      return { x: x, y: y };
    }
  }

  xBiasSelect.addEventListener('change', onInputChange);
  yBiasSelect.addEventListener('change', onInputChange);

  document.getElementById('x-bias-select')

  createParticles(space, 15, 10, 20, 20);

  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  const grapher = new Grapher("gradientChart");
  const args = {
    runSim: false,
    space: space,
    grapher: grapher,
    doCenter: false,
    isCircle: false,
  };

  const runnerClick = () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 150, SIM_LIMIT);
  }

  gradientSim.querySelector('.reset').addEventListener('click', (e) => {
    args.runSim = false;
    gradientSim.removeEventListener('click', runnerClick);
    e.stopPropagation()
    space.destroy();
    grapher.destroy();
    setUpGradientSim();
  });

  gradientSim.addEventListener("click", runnerClick);

  window.gParicles = space.particles;
};

setUpGradientSim();

const setUpCirlceSim = () => {
  const circleSim = document.getElementById("circle");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  };
  const space = new Space(circleSim, 24, 12, extraOptions);

  createParticles(space, 15, 10, 20, 20);

  space.centerParticles();
  space.updateCenterOfGravity();
  const originalCneter = space.center.cloneNode();
  originalCneter.classList.add("original");
  space.particleHolder.appendChild(originalCneter);

  const grapher = new Grapher("circleChart");
  const args = {
    runSim: false,
    space: space,
    grapher: grapher,
    doCenter: false,
    isCircle: true,
  };

  const runnerClick = () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 15, SIM_LIMIT);
  }

  circleSim.querySelector('.reset').addEventListener('click', (e) => {
    args.runSim = false;
    circleSim.removeEventListener('click', runnerClick);
    e.stopPropagation()
    space.destroy();
    grapher.destroy();
    setUpGradientSim();
  });

  circleSim.addEventListener("click", runnerClick);

  window.cParicles = space.particles;
};

setUpCirlceSim();

const setUpComputeSim = () => {
  const computeSim = document.getElementById("compute");

  const extraOptions = {
    selectorFunction: gradientSelector,
    squareWidth: 25,
  };
  const space = new Space(computeSim, 24, 12, extraOptions);

  createParticles(space, 15, 10, 20, 20);

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

  const grapher = new Grapher("computeChart");
  const args = {
    runSim: false,
    space: space,
    grapher: grapher,
    doCenter: false,
    isCircle: true,
    callback: updateFunc,
  };

  const runnerClick = () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 15, SIM_LIMIT);
  }

  computeSim.querySelector('.reset').addEventListener('click', (e) => {
    args.runSim = false;
    computeSim.removeEventListener('click', runnerClick);
    e.stopPropagation()
    space.destroy();
    grapher.destroy();
    setUpGradientSim();
  });

  computeSim.addEventListener("click", runnerClick);

  window.compParicles = space.particles;
};

setUpComputeSim();
