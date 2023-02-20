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


const VendorBankDetailSection = (props) => {
    const vendor = props.data.vendor;

  return (

    <div>

        <AccordionItem>
            <h2>
            <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    EIN and Bank Details
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
                                 EIN
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.ein}
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

export default VendorBankDetailSection;
