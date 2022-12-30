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
                        <Text pt='table_display_value' fontSize='table_display_value'>
                            {project.id}
                        </Text>
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Name
                    </Th>
                    <Th>
                        <Text pt='table_display_value' fontSize='table_display_value'>                        
                            {project.name}
                        </Text>
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Description
                    </Th>
                    <Th>
                        <Text pt='table_display_value' fontSize='table_display_value'> 
                            {project.description}
                        </Text>
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Project Type
                    </Th>
                    <Th>
                        <Text pt='table_display_value' fontSize='table_display_value'>                        
                            {project.type}
                        </Text>
                    </Th>
                </Tr>
                <Tr >
                    <Th bgColor="table_tile">
                    Invoice Cycle
                    </Th>
                    <Th>
                        <Text pt='table_display_value' fontSize='table_display_value'>
                            {project.invoiceCycle}
                        </Text>
                    </Th>
                </Tr>                                                                                                        
                </Tbody>
            </Table>
        </TableContainer>    
    </div>


  );
};

export default ProjectDetailSection;
