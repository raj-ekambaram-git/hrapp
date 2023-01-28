export { CashFlowReportSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import {accountService, userService} from '../../../services'
import {barChart} from '../../../components/common/charts/barChart'
import { util } from '../../../helpers/util';
import Chart from 'chart.js/auto'

function CashFlowReportSection(props) {
    const [cashFlowData, setCashFlowData] = useState();

    useEffect(() => {
        getCashFlowData()
        removeChart(props.canvasId)
      }, [props.canvasId]);
    
      const getCashFlowData = async () => {
        if(userService.isAccountAdmin()) {
            const cashFlowData = await accountService.getCashFlowData(userService.getAccountDetails().accountId);
                if(cashFlowData) {

                    const labels = []; 
                    const datasets = [];
                    if(cashFlowData.weekly && cashFlowData?.weekly?.length > 0) {
                        populateDataSet(cashFlowData.weekly, labels, datasets, "Week: ")
                    }
                    if(cashFlowData.monthly && cashFlowData?.monthly?.length > 0) {
                        populateDataSet(cashFlowData.monthly, labels, datasets, "Month: ")
                    }                    
                    const data = {
                        labels: labels,
                        datasets: datasets
                    };
                
                    console.log("DATTA::"+JSON.stringify(data))
                    // const subtitle = {
                    //     display: true,
                    //     text: "Total Revenue: $"+util.getZeroPriceForNull(allProjectActualRevenue),
                    //     color: 'blue',
                    //     font: {
                    //     size: 12,
                    //     family: 'tahoma',
                    //     weight: 'normal',
                    //     style: 'italic'
                    //     },
                    //     padding: {
                    //     bottom: 10
                    //     }
                    // }
                
                    barChart({
                        canvasId: props.canvasId, 
                        chartData: data, 
                        titleText: 'Lifetime Cash Flow: $ '+(util.getZeroPriceForNull(cashFlowData?.lifeTime[0]?.total)), 
                        subtitleData: {},
                        position:'top',
                        axis: "x"
                    })

                }else {
                    removeChart(props.canvasId)
                }
                setCashFlowData(cashFlowData)
        

            } else {
                removeChart(props.canvasId)
            }                    
        }

    const removeChart = () => {
        let chartStatus = Chart.getChart(props.canvasId); // <canvas> id
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
    }        

    function populateDataSet(dataInput, labels, dataSet, labelName) {
        let count = 0
        dataInput?.map((dataVal) => {
            if(count>2) {
                return
            }
            count++
            labels.push(labelName+util.getDayMonthFormat(dataVal.tx_period))
            const totalArray = dataVal.total.split(",")
            let netAmount = 0;
            totalArray?.map((amountString) => {
                if(amountString) {
                    const amountVal = amountString.split("_")
                    if(amountVal[0] === "Paid") {
                        netAmount = netAmount+parseFloat(amountVal[1])
                    }else {
                        netAmount = netAmount-parseFloat(amountVal[1])
                    }
                }
            })
            const data = {
                label: labelName+util.getDayMonthFormat(dataVal.tx_period),
                data: [netAmount],
                }
                dataSet.push(data)
        })
        
        // return {labels, dataSet}
    }
       
    return (
        <Card variant="cashFlowDashboard">
            <CardHeader>
                <HStack>
                    <Box>
                        Cash Flow
                    </Box>
                </HStack>
                
            </CardHeader>
            <CardBody>
                    <canvas id={props.canvasId}></canvas>
            </CardBody>
        </Card>

    );
}