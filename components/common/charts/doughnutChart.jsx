import Chart from 'chart.js/auto'

export const doughnutChart = ({ canvasId, chartData, titleText, position }) => {
    return new Chart(
        document.getElementById(canvasId),
        {
          type: 'doughnut',
          data: {
            labels: chartData.map(row => row.key),
            datasets: [
              {
                data: chartData.map(row => row.value)
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: position,
              },
              title: {
                display: true,
                text: titleText
              }
            }
          }
        }
      );
}
