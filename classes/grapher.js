import { getTrendline } from "./stats.js";
export default class Grapher {
  constructor(elemId) {
    this.elem = document.getElementById(elemId);

    const ctx = this.elem.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Particle Pos St Dev Avg',
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
              text: 'Standard Deviation'
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
    return getTrendline(datasets[0].data);
  }

}