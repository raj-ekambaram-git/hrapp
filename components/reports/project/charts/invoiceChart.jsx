import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { InvoiceStatus } from "@prisma/client";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function InvoiceChart(props) {

  useEffect(() => {
    if(props.invoice) {
      invoiceData();
    }  
  }, [props.invoice]);

  function invoiceData(){
    let invoicedTotal = 0;
    let invoicePaid = 0;
    
    props.invoice?.map(inv => {
        invoicedTotal = parseFloat(invoicedTotal)+parseFloat(inv?.total)
        if((inv.status === InvoiceStatus.Paid || inv.status === InvoiceStatus.PartiallyPaid)) {
          invoicePaid = parseFloat(invoicePaid)+parseFloat(inv?.paidAmount)
        }
      })
    
    if(invoicedTotal>0) {
      const data = [];
      data.push({ key: "Paid $"+invoicePaid, value: invoicePaid });
      data.push({ key: "Unpaid $"+(util.getZeroPriceForNull(invoicedTotal)-invoicePaid), value: (util.getZeroPriceForNull(invoicedTotal)-invoicePaid) })
      let chartStatus = Chart.getChart("invoice"); // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
      doughnutChart({
        canvasId:"invoice", 
        chartData: data, 
        titleText: 'Invoiced: $'+util.getZeroPriceForNull(invoicedTotal), 
        position:'top'})
  
    }

   
  
  }

  return (
    <>    
      <Box width="25%">
        <canvas id="invoice"></canvas>        
      </Box>        
    </>
  );
}
