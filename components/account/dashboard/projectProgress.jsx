export { ProjectProgress };
import Chart from 'chart.js/auto'
import {
    Box,
    Card,
    CardBody,
    CardHeader,
  } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {userService} from '../../../services'

function ProjectProgress(props) {

    const router = useRouter();
    const [prpjectProgressData, setPrpjectProgressData] = useState(true);

    useEffect(() => {
        getProjectProgressData()
      }, []);
    
      const getProjectProgressData = async () => {
            const projectProgressData = await userService.getProjectProgressData(userService.userValue?.id, userService.getAccountDetails().accountId);
            console.log("projectProgressData::"+JSON.stringify(projectProgressData))
            if(projectProgressData && projectProgressData.length > 0) {
                // setPrpjectProgressData(projectProgressData)
                removeChart();

                const projectDataSet = [];
                projectProgressData.map((projectData) => {
                    const projectRecord = {
                        label: projectData.project?.name,
                        data: [(parseFloat(projectData.usedBudget)*100)/parseFloat(projectData.budgetAllocated), 100],
                        barThickness: 15,
                        categoryPercentage: 5
                    }
                    projectDataSet.push(projectRecord)
                })


                new Chart(
                    document.getElementById("projectProgress1").getContext("2d"),
                    {
                      type: 'bar',
                      data: { 
                        labels: ["Projects"],
                        datasets: projectDataSet
                      },
                      options: {
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
                setPrpjectProgressData(false)
                removeChart()
            }

      }

      const removeChart = () => {
        let chartStatus = Chart.getChart("projectProgress1"); // <canvas> id
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
                        <canvas id="projectProgress1" height="100px"></canvas>
                    </Box>                             
                    </CardBody>
                </Card>               
            </>:<></>} 
        </>
    );
}