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
                    if(cashFlowData.monthly && cashFlowData?.monthly?.length > 0) {
                        cashFlowData.monthly?.map((monthData) => {
                            labels.push(util.getFormattedDate(monthData.txn_month))
                            console.log("monthData.monthly_sum::"+monthData.monthly_sum)
                            const dataSet = {
                                label: util.getFormattedDate(monthData.txn_month),
                                data: parseFloat(monthData.monthly_sum)
                            }
                            datasets.push(dataSet)
                        })
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