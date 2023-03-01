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


const VendorContactDetailSection = (props) => {
    const vendor = props.data.vendor;

  return (

    <div>
        
        <AccordionItem>
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                     Contact
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
                            <Th bgColor="table_tile">
                                 Contact Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.vendorContactName}
                                </Text>
                            </Th>
                        </Tr>                            
                        <Tr >
                            <Th bgColor="table_tile" width="project.details.column1">
                                 Contact Email
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.email}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                 Contact Phone
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.phone}
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

export default VendorContactDetailSection;
