import Chart from 'chart.js/auto'

export const horizontalBarChart = ({ canvasId, chartData, titleText, subtitleData, position }) => {

    return new Chart(
        document.getElementById(canvasId),
        {
          type: 'bar',
          data: chartData,
          options: {
            indexAxis: 'y',
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
              bar: {
                borderWidth: 1,                
              }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: titleText
              },
              subtitle: subtitleData,
            }
          },
        }
      );
}
