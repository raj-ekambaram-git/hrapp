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
    
                    const data = {
                        labels: labels,
                        datasets: [
                        {
                            label: 'Estimated Revenue',
                            data: "10",
                        },
                        {
                            label: 'sdsde',
                            data: "20",
                        },
                        ]
                    };
                
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
                        titleText: 'Lifetime Cash Flow: $'+(util.getZeroPriceForNull(cashFlowData?.lifeTime[0]?.total)), 
                        subtitleData: {},
                        position:'top',
                        axis: "y"
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