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


const AccountContactAddressSection = (props) => {
    const account = props.data.account;
    console.log("account::"+JSON.stringify(account))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs' textTransform='uppercase'>
                        Account Contact Address
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
                                    Address
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>  
                                        {account.addressName} <br/>
                                        {account.address1} <br/>
                                        {account.address2 ? (
                                            <>
                                                {account.address2}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {account.address3 ? (
                                            <>
                                                {account.address3}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {account.city}, {account.state} { account.zipCode}  <br/>
                                        {account.country} <br/>
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

export default AccountContactAddressSection;
