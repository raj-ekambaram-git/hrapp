export { ProjectProgress };
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

function ProjectProgress(props) {

    const router = useRouter();
    const [prpjectProgressData, setPrpjectProgressData] = useState();
    useEffect(() => {
        getProjectProgressData()
      }, []);
    
      const getProjectProgressData = async () => {
            const projectProgressData = await userService.getProjectProgressData(userService.userValue.id, userService.getAccountDetails().accountId);
            console.log("projectProgressData:::"+JSON.stringify(projectProgressData))
            setPrpjectProgressData(projectProgressData)
      }

    return (
        <>
            {prpjectProgressData?<>
                <Card variant="projectProgress">
                    <CardHeader>
                        All your assigned project progress
                    </CardHeader>
                    <CardBody>
                    <Box width="25%">
                        <canvas id="projectProgress"></canvas>
                    </Box>                             
                    </CardBody>
                </Card>
            </>:<></>}
        </>

    );
}