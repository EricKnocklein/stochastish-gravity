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

  createParticles(space, 15, 10, 10, 10);

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
  globalSim.addEventListener("click", () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 1, 45000);
  });

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

  createParticles(space, 15, 10, 10, 10);

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
  gradientSim.addEventListener("click", () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 150, 45000);
  });

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

  createParticles(space, 15, 10, 10, 10);

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
  circleSim.addEventListener("click", () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 10, 45000);
  });

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

  createParticles(space, 15, 10, 10, 10);

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
  computeSim.addEventListener("click", () => {
    args.runSim = !args.runSim;
    console.log(grapher.getTrendlines());
    runner(args, 10, 45000);
  });

  window.compParicles = space.particles;
};

setUpComputeSim();
