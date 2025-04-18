export default class Grapher {
  constructor(elemId) {
    this.elem = document.getElementById(elemId);

    const ctx = this.elem.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Numeric XY Data',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          showLine: true,     // Connect the dots with a line
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        }]
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
              text: 'X Axis'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Y Axis'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  addPoint(point) {
    this.chart.data.datasets[0].data.push(point);
    this.chart.update();
  }

}