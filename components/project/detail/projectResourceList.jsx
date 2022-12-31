import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
  AccordionItem,
  AccordionButton,
  Box,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Text,
  HStack,
  useToast
} from '@chakra-ui/react';
import {
  DeleteIcon,EditIcon
} from '@chakra-ui/icons';
import AddProjectResource from "../addProjectResource";
import { projectService } from "../../../services";



const ProjectResourceList = (props) => {
  const toast = useToast();

  const projectResourceList = props.data.projectResourceList;
  const addProjectResourceRequest = props.data.addProjectResourceRequest;
  
  console.log("addProjectResourceRequest::::"+JSON.stringify(addProjectResourceRequest)); 

  async function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget) {
    const projectResourceDeleteResponse = await projectService.deleteProjectResource(projectResourceId,projectResourceAllocatedBudget);
    console.log("projectResourceDeleteResponse:::"+JSON.stringify(projectResourceDeleteResponse));
    if(projectResourceDeleteResponse != undefined && !projectResourceDeleteResponse.error) {
      addProjectResourceRequest.handleAddProjectResource(projectResourceDeleteResponse, projectResourceDeleteResponse[0].project.id, (parseFloat(projectResourceDeleteResponse[0].project.remainingBudgetToAllocate)+parseFloat(projectResourceAllocatedBudget)));
      toast({
        title: 'Project Resource.',
        description: 'Successfully deleted project resource.',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })  
    }else {
      toast({
        title: 'Project Resource.',
        description: 'Error deleting project resource. Please try again or contact administrator.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })  
    }
  
  }

  
  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
          <h2>
            <AccordionButton bgColor="table_tile">
              <Box as="span" flex='1' textAlign='left'>
                <Heading size='xs' textTransform='uppercase'>
                  Project Resource
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text pt='2' fontSize='sm'>
              <AddProjectResource data={addProjectResourceRequest}></AddProjectResource>
              <TableContainer marginTop="1rem">
                <Table>
                <TableCaption></TableCaption>
                  <Thead>
                      <Tr bgColor="table_tile">
                        <Th>
                        </Th>                        
                        <Th>
                          Resource
                        </Th>
                        <Th>
                          Type
                        </Th>    
                        <Th>
                          Max Budget Allocated
                        </Th>
                        <Th>
                          Price
                        </Th>
                        <Th>
                          Currency
                        </Th>
                        <Th>
                          Quantity
                        </Th>
                        <Th>
                          Quantity UOM
                        </Th> 
                        <Th>
                          Timesheet Approver
                        </Th>                                                                
                      </Tr>   
                    </Thead>                
                    <Tbody>
                      {projectResourceList?.map((projectResource) => (
                        <Tr>
                              <Th>
                                <HStack spacing={4}>
                                  <DeleteIcon onClick={() => deleteProjectResource(projectResource.id,projectResource.budgetAllocated)}/>
                                  <EditIcon onClick={() => editProjectResource(projectResource.id)}/>
                                </HStack>
                              </Th>
                              <Th>
                                {projectResource.user.firstName} {projectResource.user.lastName}
                              </Th>
                              <Th>
                                {projectResource.billable ? "Billable" : "Non Billable"}
                              </Th>
                              <Th>
                                  <b>$</b>{projectResource.budgetAllocated}
                              </Th>
                              <Th>
                                {projectResource.unitPrice}
                              </Th>
                              <Th>
                                {projectResource.currency}
                              </Th>                              
                              <Th>
                                {projectResource.quantity}
                              </Th>
                              <Th>
                                {projectResource.uom}
                              </Th>      
                              <Th>
                                {projectResource.isTimesheetApprover ? "Approver" : "No"}
                              </Th> 
                        </Tr>
                      ))}
                  </Tbody>    
                </Table>
              </TableContainer>                 
            </Text>  
          </AccordionPanel>
        </AccordionItem>   

    </div>


  );
};

export default ProjectResourceList;
