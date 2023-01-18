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
import { useSelector } from "react-redux";


const ProjectAccountSection = (props) => {
    const project = props.data.project;
    const remainingBudget = useSelector(state => state.project.remainingBudget);
    
    
  return (

    <div>
        
        <AccordionItem>
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs' textTransform='uppercase'>
                    Project Financials
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
                                    Payment Terms
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        {project.paymentTerms}
                                    </Text>
                                </Th>
                            </Tr>

                            <Tr >
                                <Th bgColor="table_tile" width="project.details.column1">
                                    Budget
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        ${project.budget}
                                    </Text>
                                </Th>
                            </Tr>
                            <Tr >
                                <Th bgColor="table_tile" width="project.details.column1">
                                    Used Budget
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        ${project.usedBudget}
                                    </Text>
                                </Th>
                            </Tr>                        
                            <Tr>
                                <Th bgColor="table_tile" width="project.details.column1">
                                        Remaining Budget to allocate
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        ${remainingBudget}
                                    </Text>
                                </Th>
                            </Tr>
                            <Tr>
                                <Th bgColor="table_tile" width="project.details.column1">
                                        Miscellaneous Budget
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        ${project.miscBudget?project.miscBudget:0}
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

export default ProjectAccountSection;
