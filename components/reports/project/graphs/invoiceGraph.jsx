import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { InvoiceStatus } from "@prisma/client";



export default function InvoiceGraph(props) {

  useEffect(() => {
    console.log("BudgetGraph.selectedReport::"+JSON.stringify(props.project))
    if(props.project) {
      budgetData();
    }    
  }, []);
  


  function budgetData() {

    let invoicedTotal = 0;
    let invoicePaid = 0;
    props.project?.invoice?.map(inv => invoicedTotal = parseFloat(invoicedTotal)+parseFloat(inv?.total))
    props.project?.invoice?.map(inv => {
        if((inv.status === InvoiceStatus.Paid || inv.status === InvoiceStatus.PartiallyPaid)) {
          invoicePaid = parseFloat(invoicePaid)+parseFloat(inv?.paidAmount)
        }
      })
    

    const data = [
      { key: "Paid Invoice $"+invoicePaid, value: invoicePaid },
      { key: "Unpaid Invoice $"+(util.getZeroPriceForNull(invoicedTotal)-invoicePaid), value: (util.getZeroPriceForNull(invoicedTotal)-invoicePaid) },
    ];

    let chartStatus = Chart.getChart("invoiceChart"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    const invoiceChart = new Chart(
      document.getElementById('invoice'),
      {
        type: 'doughnut',
        data: {
          labels: data.map(row => row.key),
          datasets: [
            {
              data: data.map(row => row.value)
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Invoiced Total: $'+util.getZeroPriceForNull(invoicedTotal)
            }
          }
        }
      }
    );
    
  }

  return (
    <>    
        <canvas id="invoice"></canvas>
        
    </>
  );
}
