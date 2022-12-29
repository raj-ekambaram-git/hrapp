import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
} from '@chakra-ui/react';


const ProjectAccountSection = (props) => {
    const projectAccountName = props.data.projectAccountName;
    const projectVendorName = props.data.projectVendorName;
    
  return (

    <div>
        
        <TableContainer  marginTop="2rem">
            <Table>
                <TableCaption></TableCaption>
                <Thead></Thead>
                <Tbody>
                <Tr >
                    <Th bgColor="table_tile" width="project.details.column1">
                        Account
                    </Th>
                    <Th>
                    {projectAccountName}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                        Vendor
                    </Th>
                    <Th>
                    {projectVendorName}
                    </Th>
                </Tr>                                                                                                    
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectAccountSection;
