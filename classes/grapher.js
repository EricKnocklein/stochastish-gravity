import { getTrendline } from "./stats.js";
export default class Grapher {
  constructor(elemId) {
    this.elem = document.getElementById(elemId);
    this.elem.classList.add("loaded");

    const ctx = this.elem.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Average Standard Deviation',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          showLine: true,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          trendlineLinear: {
            style: "rgba(75, 192, 192, 0.5)",
            lineStyle: "dotted",
            width: 2
          }
        },
        {
          label: 'Average Span / 2',
          data: [],
          borderColor: 'rgb(83, 192, 75)',
          borderWidth: 2,
          showLine: true,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          trendlineLinear: {
            style: "rgba(75, 192, 192, 0.5)",
            lineStyle: "dotted",
            width: 2
          }
        }
      ]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Number of particles updated'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Standard Deviation or Span'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  addPoint(point, dataset) {
    this.chart.data.datasets[dataset].data.push(point);
    this.chart.update();
  }

  getTrendlines() {
    const datasets = this.chart.data.datasets
    return {
      sd: getTrendline(datasets[0].data),
      span: getTrendline(datasets[1].data),
    }
  }

  destroy() {
    this.elem.classList.remove("loaded");
    this.chart.destroy();
    delete this.chart.data;
  }

}