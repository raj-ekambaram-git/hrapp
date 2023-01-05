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


const ProjectLocationSection = (props) => {
    const projectLocation = props.data.projectLocation;


    console.log("ProjectLocationSection::"+JSON.stringify(projectLocation))

  return (

    <div>
        <AccordionItem>
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs' textTransform='uppercase'>
                    Project Location
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
                                Project Location
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>  
                                    {projectLocation.addressName} <br/>
                                    {projectLocation.address1} <br/>
                                    {projectLocation.address2 ? (
                                        <>
                                            {projectLocation.address2}<br/>
                                        </>
                                        ):(
                                        <>
                                        </>
                                        )} 
                                    {projectLocation.address3 ? (
                                        <>
                                            {projectLocation.address3}<br/>
                                        </>
                                        ):(
                                        <>
                                        </>
                                        )} 
                                    {projectLocation.city}, {projectLocation.state} {projectLocation.zipCode}  <br/>
                                    {projectLocation.country} <br/>
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

export default ProjectLocationSection;
