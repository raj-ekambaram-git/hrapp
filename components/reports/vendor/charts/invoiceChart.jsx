import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { InvoiceStatus } from "@prisma/client";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function InvoiceChart(props) {

  useEffect(() => {
    if(props.projects && props.projects.length > 0) {
      invoiceData();
    }else {
      removeChart()
    }
  }, [props.projects]);

  function invoiceData(){
    let invoicedTotal = 0;
    let invoicePaid = 0;
    

    props.projects?.map(project => {
      project.invoice?.map(inv => {
        invoicedTotal = parseFloat(invoicedTotal)+parseFloat(inv?.total)
        if((inv.status === InvoiceStatus.Paid || inv.status === InvoiceStatus.PartiallyPaid)) {
          invoicePaid = parseFloat(invoicePaid)+parseFloat(inv?.paidAmount)
        }
      })
    })
    
    if(invoicedTotal>0) {
      const data = [];
      data.push({ key: "Paid $"+invoicePaid, value: invoicePaid });
      data.push({ key: "Unpaid $"+(util.getZeroPriceForNull(invoicedTotal)-invoicePaid), value: (util.getZeroPriceForNull(invoicedTotal)-invoicePaid) })
      removeChart()
      doughnutChart({
        canvasId:"vendorInvoice", 
        chartData: data, 
        titleText: 'Invoiced: $'+util.getZeroPriceForNull(invoicedTotal), 
        position:'top'})  
    }else {
      removeChart()
    }  
  }

  const removeChart = () => {
    let chartStatus = Chart.getChart("vendorInvoice"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  }

  return (
    <>    
      <Box width="25%">
        <canvas id="vendorInvoice"></canvas>        
      </Box>        
    </>
  );
}
