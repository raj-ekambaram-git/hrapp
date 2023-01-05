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


const ProjectContactDetailSection = (props) => {
    const project = props.data.project;

    console.log("ProjectContactDetailSection::"+JSON.stringify(project))

  return (

    <div>
        <AccordionItem >
            <h2>
                <AccordionButton >
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs' textTransform='uppercase'>
                    Project Contact
                    </Heading>
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
                                Contact Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>                        
                                    {project.contactName}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                Contact Email
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {project.contactEmail}
                                </Text>
                            </Th>
                        </Tr>  
                        <Tr >
                            <Th bgColor="table_tile">
                                Contact Phone
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {project.contactPhone}
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

export default ProjectContactDetailSection;
