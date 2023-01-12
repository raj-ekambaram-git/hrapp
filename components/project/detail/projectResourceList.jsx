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
  DeleteIcon
} from '@chakra-ui/icons';
import AddProjectResource from "../addProjectResourceSection";
import EditProjectResource from "../editProjectResource";
import { projectService } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { removeProjectResourceByIndex, setSelectedProjectRemainingBudget, setSelectedProjectResources } from "../../../store/modules/Project/actions";




const ProjectResourceList = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const projectResourceList = useSelector(state => state.project.projectResources);

  async function deleteProjectResource(projectResourceId, projectResourceAllocatedBudget, billable, selectIndex) {
    const projectResourceDeleteResponse = await projectService.deleteProjectResource(projectResourceId,projectResourceAllocatedBudget, billable);
    console.log("projectResourceDeleteResponse:::"+JSON.stringify(projectResourceDeleteResponse));
    if(projectResourceDeleteResponse != undefined && !projectResourceDeleteResponse.error) {

      dispatch(removeProjectResourceByIndex(selectIndex))
      if(billable) {
        dispatch(setSelectedProjectRemainingBudget(projectResourceDeleteResponse.remaininBudgetToUpdate))
      }
      
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
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left'>
                <Heading size='xs' textTransform='uppercase'>
                  Project Allocation 
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
              <AddProjectResource/>
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
                      {projectResourceList?.map((projectResource, index) => (
                        <Tr>

                              <Th>
                                <HStack spacing={4}>
                                  <DeleteIcon onClick={() => deleteProjectResource(projectResource.id,projectResource.budgetAllocated,projectResource.billable, index)}/>
                                  {/* <EditProjectResource data={{editProjectResourceRequest}}></EditProjectResource> */}
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
            
          </AccordionPanel>
        </AccordionItem>   

    </div>


  );
};

export default ProjectResourceList;
