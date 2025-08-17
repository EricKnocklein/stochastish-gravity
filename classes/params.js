class Params {
  static sim_limit = 90000;
  static biases = {
    noBias: () => {
      return Math.random();
    },
    lowBias: () => {
      return 1 - Params.biases.highBias();
    },
    highBias: () => {
      return Math.random() ** (1 / 2);
    },
    midBias: () => {
      return (Math.random() + Math.random()) / 2;
    },
    outBias: () => {
      let x = Math.random();
      return x < 0.5 ? x * x * 2 : 1 - (1 - x) * (1 - x) * 2;
    },
  };

  static _doShowGraphs = true;
  static set doShowGraphs(val) {
    Params._doShowGraphs = val;
    const graphs = document.querySelectorAll('graph');
    graphs.forEach((graph) => {
      graph.style.display = val ? 'block' : 'none';
    });
  }
}

export default Params;
