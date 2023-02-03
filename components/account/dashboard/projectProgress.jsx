export { ProjectProgress };
import Chart from 'chart.js/auto'
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Stack,
  } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { util } from '../../../helpers/util';
import {userService} from '../../../services'
import {horizontalBarChart} from '../../../components/common/charts/horizontalBarChart'
function ProjectProgress(props) {

    const router = useRouter();
    const [prpjectProgressData, setPrpjectProgressData] = useState();
    useEffect(() => {
        getProjectProgressData()
      }, []);
    
      const getProjectProgressData = async () => {
            const projectProgressData = await userService.getProjectProgressData(userService.userValue.id, userService.getAccountDetails().accountId);
            console.log("projectProgressData:::"+JSON.stringify(projectProgressData))
            if(projectProgressData && projectProgressData.length > 0) {
                setPrpjectProgressData(projectProgressData)
                removeChart();

                const chart =  new Chart(
                    document.getElementById("projectProgress"),
                    {
                      type: 'bar',
                      data: {
                        labels: ["Projects"],
                        datasets: [
                            {
                                label: "Project 1",
                                data: [75],
                                backgroundColor: '#3d4ca6',
                                borderColor: 'transparent',
                                barThickness: 15,
                                categoryPercentage: 5
                            }, 
                            {
                                label: "Project 2",
                                data: [40],
                                backgroundColor: 'red',
                                borderColor: 'transparent',
                                barThickness: 15,          
                                categoryPercentage: 5                      
                            },                             
                                                                     
                        ]
                      },
                      options: {
                        maintainAspectRatio: false,
                        elements: {
                            bar: {
                                borderWidth: "500px",
                            }
                        },
                        responsive: true,
                        indexAxis: 'y',
                        plugins: {
                        }
                      }
                    }
                  );
            }else {
                removeChart()
            }

      }

      const removeChart = () => {
        let chartStatus = Chart.getChart("projectProgress"); // <canvas> id
        if (chartStatus != undefined) {
          chartStatus.destroy();
        }
      }

    return (
        <>
            {prpjectProgressData?<>
                <Card variant="projectProgress">
                    <CardHeader>
                        All your assigned project progress
                    </CardHeader>
                    <CardBody>
                    <Box>
                        <canvas id="projectProgress" height="100px"></canvas>
                    </Box>                             
                    </CardBody>
                </Card>
            </>:<></>}
        </>

    );
}