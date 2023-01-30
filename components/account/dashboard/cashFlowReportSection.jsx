export { CashFlowReportSection };
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import {accountService, userService} from '../../../services'
import { util } from '../../../helpers/util';
import {InnerCardSection} from '../../../components/account/dashboard/common/innterCardSection'

function CashFlowReportSection(props) {
    const [cashFlowData, setCashFlowData] = useState();

    useEffect(() => {
        getCashFlowData()
      }, [props.canvasId]);
    
      const getCashFlowData = async () => {
        if(userService.isAccountAdmin()) {
            const cashFlowData = await accountService.getCashFlowData(userService.getAccountDetails().accountId);
                 const finalCashFlowData = {};
                 finalCashFlowData["lifetime"] = util.getWithCurrency(cashFlowData?.lifeTime[0]?.total);
                 finalCashFlowData["lifetimeExp"] = util.getWithCurrency(cashFlowData?.lifeTimeExp[0]?.total);
                if(cashFlowData) {
                    if(cashFlowData.weekly && cashFlowData?.weekly?.length > 0) {
                        const weeklyData = populateDataSet(cashFlowData.weekly, "Week ")
                        finalCashFlowData["weekly"] = weeklyData
                    }
                    if(cashFlowData.monthly && cashFlowData?.monthly?.length > 0) {
                        const monthlyData = populateDataSet(cashFlowData.monthly, "Month ")
                        finalCashFlowData["monthly"] = monthlyData
                    }            
                    if(cashFlowData.monthlyExp && cashFlowData?.monthlyExp?.length > 0) {
                        const monthlyData = populateDataSet(cashFlowData.monthlyExp, "Month ")
                        finalCashFlowData["monthlyExp"] = monthlyData
                    }  
                    if(cashFlowData.weeklyExp && cashFlowData?.weeklyExp?.length > 0) {
                        const weeklyExpData = populateDataSet(cashFlowData.weeklyExp, "Week ")
                        finalCashFlowData["weeklyExp"] = weeklyExpData
                    }                                                         
                }

                console.log("finalCashFlowData::::"+JSON.stringify(finalCashFlowData))
                setCashFlowData(finalCashFlowData)
        

            }                   
        }
   

    function populateDataSet(dataInput, labelPrefix) {
        let count = 0
        const dataSet = []
        dataInput?.map((dataVal) => {
            if(count>2) {
                return
            }
            count++
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
                
                const data = {label: labelPrefix+(labelPrefix == "Month "?util.getMonthFormat(dataVal.tx_period):util.getDayMonthFormat(dataVal.tx_period)), amount: netAmount}
                dataSet.push(data)
        })
        return dataSet;
    }
       
    return (
        <>
            {cashFlowData?
                <Card variant="cashFlowDashboard">
                    <CardHeader>
                        <HStack>
                            <Box>
                                Cash Flow
                            </Box>
                        </HStack>                
                    </CardHeader>
                    <CardBody variant="cashFlowDashboard">
                        <Stack spacing={4}>
                            <Stack>
                                <HStack>
                                    <Box fontWeight="700" color="debit_amount">
                                        Received
                                    </Box>
                                </HStack>
                                <HStack>
                                    {cashFlowData?.lifetime?<InnerCardSection headerData="Overall" bodyData={cashFlowData?.lifetime} fColor="debit_amount"/>:<></>}
                                    {cashFlowData?.weekly && cashFlowData?.weekly[0]?.label?<InnerCardSection headerData={cashFlowData?.weekly[0]?.label} bodyData={util.getWithCurrency(cashFlowData?.weekly[0]?.amount)} fColor={cashFlowData?.weekly[0]?.amount<cashFlowData?.weekly[1]?.amount?"credit_amount":"debit_amount"}/>:<></>}
                                    {cashFlowData?.weekly && cashFlowData?.weekly[1]?.label?<InnerCardSection headerData={cashFlowData?.weekly[1]?.label} bodyData={util.getWithCurrency(cashFlowData?.weekly[1]?.amount)}/>:<></>}
                                    {cashFlowData?.weekly && cashFlowData?.monthly[0]?.label?<InnerCardSection headerData={cashFlowData?.monthly[0]?.label} bodyData={util.getWithCurrency(cashFlowData?.monthly[0]?.amount)} fColor={cashFlowData?.monthly[0]?.amount<cashFlowData?.monthly[1]?.amount?"credit_amount":"debit_amount"}/>:<></>}
                                    {cashFlowData?.weekly && cashFlowData?.monthly[1]?.label?<InnerCardSection headerData={cashFlowData?.monthly[1]?.label} bodyData={util.getWithCurrency(cashFlowData?.monthly[1]?.amount)}/>:<></>}                             
                                </HStack>
                            </Stack>
                            <Stack>
                                <HStack>
                                    <Box fontWeight="700" color="credit_amount">
                                        Paid
                                    </Box>
                                </HStack>
                                <HStack>
                                    <InnerCardSection headerData="Overall" bodyData={cashFlowData?.lifetimeExp}/>
                                    {cashFlowData?.weeklyExp && cashFlowData?.weeklyExp[0]?.label?<InnerCardSection headerData={cashFlowData?.weeklyExp[0]?.label} bodyData={util.getWithCurrency(cashFlowData?.weeklyExp[0]?.amount)}/>:<></>}
                                    {cashFlowData?.weeklyExp && cashFlowData?.weeklyExp[1]?.label?<InnerCardSection headerData={cashFlowData?.weeklyExp[1]?.label} bodyData={util.getWithCurrency(cashFlowData?.weeklyExp[1]?.amount)}/>:<></>}
                                    {cashFlowData?.weeklyExp && cashFlowData?.monthlyExp[0]?.label?<InnerCardSection headerData={cashFlowData?.monthlyExp[0]?.label} bodyData={util.getWithCurrency(cashFlowData?.monthlyExp[0]?.amount)}/>:<></>}
                                    {cashFlowData?.weeklyExp && cashFlowData?.monthlyExp[1]?.label?<InnerCardSection headerData={cashFlowData?.monthlyExp[1]?.label} bodyData={util.getWithCurrency(cashFlowData?.monthlyExp[1]?.amount)}/>:<></>}                             
                                </HStack>
                            </Stack>
                        </Stack>
                    </CardBody>
                </Card>
            :<></>}
        </>
        


    );
}