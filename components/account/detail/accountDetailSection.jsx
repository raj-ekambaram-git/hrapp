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


const AccountDetailSection = (props) => {
    const account = props.data.account;
    console.log("account::"+JSON.stringify(account))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                        Account Details
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
                                 ID
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {account.id}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                 Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {account.name}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                 Description
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {account.description}
                                </Text>
                            </Th>
                        </Tr>                                                                                               
                        <Tr >
                            <Th bgColor="table_tile">
                                 Type
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {account.type}
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

export default AccountDetailSection;
