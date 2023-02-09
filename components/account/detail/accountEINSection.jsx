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


const AccountEINSection = (props) => {
    const account = props.data.account;
    console.log("account::"+JSON.stringify(account))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs'>
                        Account EIN
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
                                    Account EIN
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        {account.ein}
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

export default AccountEINSection;
