import Chart from 'chart.js/auto'

export const barChart = ({ canvasId, chartData, titleText, subtitleData, position, axis }) => {

    return new Chart(
        document.getElementById(canvasId),
        {
          type: 'bar',
          data: chartData,
          options: {
            indexAxis: axis,
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
                position: position,
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
