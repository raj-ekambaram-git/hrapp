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


const ProjectContactDetailSection = (props) => {
    const project = props.data.project;

    console.log("ProjectContactDetailSection::"+JSON.stringify(project))

  return (

    <div>
        
        <TableContainer  marginTop="2rem">
            <Table>
                <TableCaption></TableCaption>
                <Thead></Thead>
                <Tbody>
                <Tr >
                    <Th bgColor="table_tile" width="project.details.column1">
                        Contact Name
                    </Th>
                    <Th>
                        {project.contactName}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                        Contact Email
                    </Th>
                    <Th>
                        {project.contactEmail}
                    </Th>
                </Tr>  
                <Tr >
                    <Th bgColor="table_tile">
                        Contact Phone
                    </Th>
                    <Th>
                        {project.contactPhone}
                    </Th>
                </Tr>                                                                                                                   
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectContactDetailSection;
