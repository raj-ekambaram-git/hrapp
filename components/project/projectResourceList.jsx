import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
} from '@chakra-ui/react'


const ProjectResourceList = (props) => {
  const projectResourceList = props.data.projectResourceList;
  
  
  return (

    <div>
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
    </div>


  );
};

export default ProjectResourceList;
