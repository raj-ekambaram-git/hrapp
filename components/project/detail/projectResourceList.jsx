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
  Text
} from '@chakra-ui/react';
import AddProjectResource from "../addProjectResource";

const ProjectResourceList = (props) => {
  const projectResourceList = props.data.projectResourceList;
  const addProjectResourceRequest = props.data.addProjectResourceRequest;
  
  console.log("addProjectResourceRequest::::"+JSON.stringify(addProjectResourceRequest)); 

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
                          Resource
                        </Th>
                        <Th>
                          Type
                        </Th>      
                        <Th>
                          Timesheet Approver
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
                          Quantity
                        </Th> 
                        <Th>
                          Max Budget Allocated
                        </Th>
                      </Tr>   
                    </Thead>                
                    <Tbody>
                      
                      {projectResourceList?.map((projectResourceList) => (
                        <Tr>
                              <Th>
                                {projectResourceList.userId}
                              </Th>
                              <Th>
                                {projectResourceList.billable ? "Billable" : "Non Billable"}
                              </Th>
                              <Th>
                                {projectResourceList.isTimesheetApprover ? "Approver" : ""}
                              </Th> 
                              <Th>
                                {projectResourceList.unitPrice}
                              </Th>
                              <Th>
                                {projectResourceList.currency}
                              </Th>                              
                              <Th>
                                {projectResourceList.quantity}
                              </Th>
                              <Th>
                                {projectResourceList.uom}
                              </Th>                               
                              <Th>
                                {projectResourceList.budgetAllocated}
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
