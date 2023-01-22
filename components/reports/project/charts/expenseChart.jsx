import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { InvoiceStatus } from "@prisma/client";
import { doughnutChart } from "../../../common/charts/doughnutChart";



export default function ExpenseChart(props) {

  useEffect(() => {
    if(props.invoice) {
      expenseData();
    }    
  }, []);
  


  function expenseData() {

    let invoicedTotal = 0;
    let invoicePaid = 0;
    props.invoice?.map(inv => invoicedTotal = parseFloat(invoicedTotal)+parseFloat(inv?.total))
    props.invoice?.map(inv => {
        if((inv.status === InvoiceStatus.Paid || inv.status === InvoiceStatus.PartiallyPaid)) {
          invoicePaid = parseFloat(invoicePaid)+parseFloat(inv?.paidAmount)
        }
      })
    

    const data = [
      { key: "Paid $"+invoicePaid, value: invoicePaid },
      { key: "Unpaid $"+(util.getZeroPriceForNull(invoicedTotal)-invoicePaid), value: (util.getZeroPriceForNull(invoicedTotal)-invoicePaid) },
    ];

    let chartStatus = Chart.getChart("expense"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    doughnutChart({
      canvasId:"expense", 
      chartData: data, 
      titleText: 'Invoiced: $'+util.getZeroPriceForNull(invoicedTotal), 
      position:'top'})
   
    
  }

  return (
    <>    
        <canvas id="expense"></canvas>        
    </>
  );
}
