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


const ProjectAccountSection = (props) => {
    const projectAccountName = props.data.projectAccountName;
    const projectVendorName = props.data.projectVendorName;
    
  return (

    <div>
        
        <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs'>
                        Project Account/Vendor Details
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
            </AccordionPanel>
        </AccordionItem>          

    </div>


  );
};

export default ProjectAccountSection;
