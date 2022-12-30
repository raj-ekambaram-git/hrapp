import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
  Text
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
                        <Text pt='table_display_value' fontSize='table_display_value'>
                            {projectAccountName}
                        </Text>
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                        Vendor
                    </Th>
                    <Th>
                    <Text pt='table_display_value' fontSize='table_display_value'>                        
                        {projectVendorName}
                    </Text>
                    </Th>
                </Tr>                                                                                                    
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectAccountSection;
