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


const ProjectDetailSection = (props) => {
    const project = props.data.project;
    console.log("propsproject::"+JSON.stringify(project))

  return (

    <div>
        
        <TableContainer  marginTop="2rem">
            <Table>
                <TableCaption></TableCaption>
                <Thead></Thead>
                <Tbody>
                <Tr >
                    <Th bgColor="table_tile" width="project.details.column1">
                    Project ID
                    </Th>
                    <Th>
                    {project.id}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Name
                    </Th>
                    <Th>
                    {project.name}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Description
                    </Th>
                    <Th>
                    {project.description}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Type
                    </Th>
                    <Th>
                    {project.type}
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Invoice Cycle
                    </Th>
                    <Th>
                    {project.invoiceCycle}
                    </Th>
                </Tr>                                                                                                        
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectDetailSection;
