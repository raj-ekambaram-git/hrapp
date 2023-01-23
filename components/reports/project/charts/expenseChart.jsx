import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { ExpenseStatus, InvoiceStatus } from "@prisma/client";
import { doughnutChart } from "../../../common/charts/doughnutChart";
import { Box } from "@chakra-ui/react";



export default function ExpenseChart(props) {

  useEffect(() => {
    if(props.expense) {
      getExpenseData();
    }  
  }, [props.expense]);
  
  function getExpenseData() {
    let expenseTotal = 0;
    let expensePaid = 0;
    props.expense?.map(exp => {
        expenseTotal = parseFloat(expenseTotal)+parseFloat(exp?.total)
        if((exp.status === ExpenseStatus.Paid || exp.status === ExpenseStatus.PartiallyPaid)) {
          expensePaid = parseFloat(expensePaid)+parseFloat(exp?.paidAmount)
        }
      })
    

    const data = [
      { key: "Paid $"+expensePaid, value: expensePaid },
      { key: "Unpaid $"+(util.getZeroPriceForNull(expenseTotal)-expensePaid), value: (util.getZeroPriceForNull(expenseTotal)-expensePaid) },
    ];

    let chartStatus = Chart.getChart("expense"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    doughnutChart({
      canvasId:"expense", 
      chartData: data, 
      titleText: 'Expense: $'+util.getZeroPriceForNull(expenseTotal), 
      position:'top'})
   
    
  }

  return (
    <>    
      <Box width="25%">
        <canvas id="expense"></canvas>        
      </Box>        
    </>
  );
}
