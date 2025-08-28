import Space from "./classes/space.js";
import Grapher from "./classes/grapher.js";
import Force from "./classes/force.js";
import Params from "./classes/params.js";
import createDataDisplay from "./components/dataDisplay.js";

const ForceMenu = document.getElementById("forceMenu");
if (ForceMenu) {
  Force.buildMenu(ForceMenu);
}
const showHideMenu = document.getElementById("showHideMenu");
if (showHideMenu) {
  // Create checkbox
  const graphCheckbox = document.createElement("input");
  graphCheckbox.type = "checkbox";
  graphCheckbox.id = "showGraphsCheckbox";
  graphCheckbox.checked = Params.doShowGraphs;

  // Add label for clarity
  const graphLabel = document.createElement("label");
  graphLabel.htmlFor = "showGraphsCheckbox";
  graphLabel.innerText = "Show Graphs";

  // Append to body (or any container)
  const graphDiv = document.createElement('div');
  graphDiv.appendChild(graphCheckbox);
  graphDiv.appendChild(graphLabel);
  showHideMenu.append(graphDiv);
  // Add a generic change listener
  graphCheckbox.addEventListener("change", (event) => {
    Params.doShowGraphs = event.target.checked;
  });

  // Create checkbox
  const fieldCheckbox = document.createElement("input");
  fieldCheckbox.type = "checkbox";
  fieldCheckbox.id = "showFieldCheckbox";
  fieldCheckbox.checked = Params.doShowGraphs;

  // Add label for clarity
  const fieldLabel = document.createElement("label");
  fieldLabel.htmlFor = "showFieldCheckbox";
  fieldLabel.innerText = "Show Fields";

  // Append to body (or any container)
  const fieldDiv = document.createElement('div');
  fieldDiv.appendChild(fieldCheckbox);
  fieldDiv.appendChild(fieldLabel);
  showHideMenu.appendChild(fieldDiv);

  // Add a generic change listener
  fieldCheckbox.addEventListener("change", (event) => {
    Params.doShowForceField = event.target.checked;
  });
}
const paramMenu = document.getElementById("paramMenu");
if (paramMenu) {
  // Create label
  const label = document.createElement("label");
  label.htmlFor = "simLimit";
  label.innerText = "Simulation Limit: ";

  // Create input
  const input = document.createElement("input");
  input.type = "number";
  input.id = "simLimit";
  input.step = "1";
  input.min = "0";
  input.style.width = "100%";
  input.value = Params.sim_limit;

  // Append to body
  paramMenu.appendChild(label);
  paramMenu.appendChild(input);

  // Listen for changes
  input.addEventListener("input", (event) => {
    Params.sim_limit = parseInt(event.target.value, 10);
  });
}

setTimeout(() => {
  Force.setCoefficients(Force.coefficients);
}, 1000);

const gradientSelector = () => {
  const x = Params.biases["noBias"]();
  const y = Params.biases["noBias"]();

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

const setUpRR = (sim, args, upf, space, grapher, setupF) => {
  const runnerClick = () => {
    args.runSim = !args.runSim;
    if(!args.runSim) {
      space.renderForceField(2);
    }
    runner(args, upf, Params.sim_limit);
  }

  const reset = sim.querySelector('.reset');
  const resetF = (e) => {
    args.runSim = false;
    sim.removeEventListener('click', runnerClick);
    reset.removeEventListener('click', resetF);
    e.stopPropagation()
    space.destroy();
    grapher.destroy();
    window.setTimeout(() => {
      setupF();
    }, 100);
  }
  reset.addEventListener('click', resetF);
  sim.addEventListener("click", runnerClick);
}

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

  setUpRR(globalSim, args, 1, space, grapher, setUpGlobalSim);

  window.globalSpace = space;
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
      const x = Params.biases[xInput]();
      const y = Params.biases[yInput]();

      return { x: x, y: y };
    }
  }

  xBiasSelect.addEventListener('change', onInputChange);
  yBiasSelect.addEventListener('change', onInputChange);

  onInputChange();
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

  setUpRR(gradientSim, args, 250, space, grapher, setUpGradientSim);

  window.gradientSpace = space;
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

  setUpRR(circleSim, args, 15, space, grapher, setUpCirlceSim);

  window.circleSpace = space;
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

  setUpRR(computeSim, args, 15, space, grapher, setUpComputeSim);

  window.computeSpace = space;
};

setUpComputeSim();

const dataDisplay = document.getElementById("dataDisplay");
if (dataDisplay) {
  const canvas = createDataDisplay("dataDisplayChart");
  dataDisplay.appendChild(canvas);
};
