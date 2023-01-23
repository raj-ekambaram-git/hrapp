import Chart from 'chart.js/auto'

export const layeredDoughnutChart = ({ canvasId, chartData, titleText, position }) => {

  console.log("chartData::"+JSON.stringify(chartData))
    let labels = []
    let data1 = [];
    let data2 = [];
    chartData.map(row => {
      console.log("row::"+JSON.stringify(row))
      labels.push(row.key)
      if(row.layer === 1) {
        data1.push(row.value)
      }else {
        data2.push(row.value)
      }
    })
    console.log("Data111::"+JSON.stringify(data1)+"******Data 2:"+JSON.stringify(data2)+"*****LABELS::"+JSON.stringify(labels))

    return new Chart(
        document.getElementById(canvasId),
        {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                data: data1
              },
              {
                data: data2
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
