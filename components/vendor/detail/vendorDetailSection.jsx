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


const VendorDetailSection = (props) => {
    const vendor = props.data.vendor;
    console.log("vendor::"+JSON.stringify(vendor))

  return (

    <div>
        <AccordionItem>
            <h2>
                <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                        Vendor Details
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
                                Vendor ID
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.id}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                Vendor Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.name}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                Vendor Description
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {vendor.description}
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

export default VendorDetailSection;
