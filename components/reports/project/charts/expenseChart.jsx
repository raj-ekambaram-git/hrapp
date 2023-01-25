import React, { useEffect } from "react";
import Chart from 'chart.js/auto'
import { util } from "../../../../helpers/util";
import { ExpenseStatus } from "@prisma/client";
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
    let expProjectCost = 0
    let expBillable = 0
    let expNonBillable = 0
    props.expense?.map(exp => {
      if((exp.status != ExpenseStatus.Submitted && exp.status != ExpenseStatus.Draft)) {
        const expenseAmounts = util.getTotalBillableExpense(exp.expenseEntries);
        expenseTotal = (parseFloat(expenseTotal)+parseFloat(exp?.total))-util.getZeroPriceForNull(expenseAmounts.totalProjectCost)
      }      
      if((exp.status === ExpenseStatus.Paid || exp.status === ExpenseStatus.PartiallyPaid)) {
        const expenseAmounts = util.getTotalBillableExpense(exp.expenseEntries);
        expensePaid = parseFloat(expensePaid)+parseFloat(exp?.paidAmount)
        expProjectCost = expProjectCost+expenseAmounts?.totalProjectCost; 
        expBillable = expBillable+expenseAmounts?.billableExpense;
        expNonBillable = expNonBillable+expenseAmounts?.nonBillableExpense;

      } else if( (exp.status === ExpenseStatus.Approved || exp.status === ExpenseStatus.Invoiced)) {
        const expenseAmounts = util.getTotalBillableExpense(exp.expenseEntries);
        expBillable = expBillable+expenseAmounts?.billableExpense;
        expNonBillable = expNonBillable+expenseAmounts?.nonBillableExpense;
        expProjectCost = expProjectCost+expenseAmounts?.totalProjectCost;  
      }
      
    })

    let estProjectCost = 0;
    props.projectResource?.map(resource => {
      estProjectCost = estProjectCost+((parseFloat(resource.usedBudget)/parseFloat(resource.unitPrice))*parseFloat(resource.cost))
    })

    if(expenseTotal>0 || estProjectCost>0) {
      const data = [
      ];
  
      if(expProjectCost>0) {
        data.push({ key: "Cost $"+estProjectCost, value: estProjectCost },)
      }
      if(expBillable>0) {
        data.push({ key: "Billable $"+expBillable, value: expBillable },)
      }
      if(expNonBillable>0) {
        data.push({ key: "Non-Billable $"+expNonBillable, value: expNonBillable },)
      }      
      let chartStatus = Chart.getChart("expense"); // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      if(data && data.length == 0) {
        data.push({ key: "Total $"+expenseTotal+util.getZeroPriceForNull(estProjectCost), value: expenseTotal+util.getZeroPriceForNull(estProjectCost) },)
      }
      doughnutChart({
        canvasId:"expense", 
        chartData: data, 
        titleText: 'Expense: $'+util.getZeroPriceForNull(expenseTotal+util.getZeroPriceForNull(estProjectCost)), 
        position:'top'})
     
  
    }
    
  }

  return (
    <>    
      <Box width="25%">
        <canvas id="expense"></canvas>        
      </Box>        
    </>
  );
}
