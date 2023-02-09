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


const VendorContactAddressSection = (props) => {
    const vendorAddress = props.data.vendorAddress;
    console.log("vendor::"+JSON.stringify(vendorAddress))

  return (

    <div>
        <AccordionItem >
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                        Vendor Contact Address
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
                                    Address
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>  
                                        {vendorAddress.addressName} <br/>
                                        {vendorAddress.address1} <br/>
                                        {vendorAddress.address2 ? (
                                            <>
                                                {vendorAddress.address2}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {vendorAddress.address3 ? (
                                            <>
                                                {vendorAddress.address3}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {vendorAddress.city}, {vendorAddress.state} { vendorAddress.zipCode}  <br/>
                                        {vendorAddress.country} <br/>
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

export default VendorContactAddressSection;
