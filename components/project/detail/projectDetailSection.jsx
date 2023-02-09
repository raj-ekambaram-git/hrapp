import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  TableContainer,
  TableCaption,
  Text,
  AccordionItem,
  AccordionButton,
  Box,
  Heading,
  AccordionIcon,
  AccordionPanel
} from '@chakra-ui/react';


const ProjectDetailSection = (props) => {
    const project = props.data.project;
    console.log("propsproject::"+JSON.stringify(project))

  return (

    <div>
        
        <AccordionItem>
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                    Project Details
                </Box>
                <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
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
                        <Tr >
                            <Th bgColor="table_tile">
                            Timesheet Notes Required
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {project.timesheetNotesRequired?"Yes" : "No"}
                                </Text>
                            </Th>
                        </Tr>                                                                                                                   
                        </Tbody>
                    </Table>
                </TableContainer>   
            </AccordionPanel>
        </AccordionItem>
    </div>


  );
};

export default ProjectDetailSection;
