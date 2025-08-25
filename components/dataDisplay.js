import means from "../data/mean.js";
import medians from "../data/median.js";

const createDataDisplay = (id) => {
  const canvas = document.getElementById(id) ?? document.createElement("canvas");
  canvas.id = id;

  const ctx = canvas.getContext("2d");
  new window.Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Mean",
          data: means,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          showLine: false,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          trendlineLinear: {
            style: "rgba(75, 192, 192, 0.5)",
            lineStyle: "dotted",
            width: 2,
          },
        },
        {
          label: "Median",
          data: medians,
          borderColor: "rgb(83, 192, 75)",
          borderWidth: 2,
          showLine: false,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          trendlineLinear: {
            style: "rgba(75, 192, 192, 0.5)",
            lineStyle: "dotted",
            width: 2,
          },
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Factor of Proportionality for Wait Time",
          },
          min: -2.5,
          max: 3.5
        }
      }
    }
  });

  return canvas;
};

export default createDataDisplay;