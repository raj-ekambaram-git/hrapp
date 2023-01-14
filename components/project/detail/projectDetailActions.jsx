import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button
} from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ProjectTimesheets from '../../../components/project/detail/projectTimesheets';
import { PROJECT_CALL_TYPE } from "../../../constants";
import ManageDocuments from "../../document/manageDocuments";


const ProjectDetailActions = (props) => {
    const router = useRouter();
    const projectId = useSelector(state => state.project.selectedProjectId);

  return (

    <div>
         
        <Flex marginBottom='1rem'>
              <HStack spacing={2}>
                <Box>
                  <Button size="xs" bgColor="header_actions"  onClick={() => router.push("/account/project/edit")}>
                    Edit
                  </Button>
                </Box>
                <Box>
                  <Button size="xs" bgColor="header_actions"  onClick={() => router.push("/account/project/invoices")}>
                    Invoices
                  </Button>
                </Box>   
                <Box>
                <ProjectTimesheets data={{projectId: projectId, callType: PROJECT_CALL_TYPE}}/>
                </Box>   
                <ManageDocuments/>                 
              </HStack>
        </Flex>           
    </div>
  );
};

export default ProjectDetailActions;
