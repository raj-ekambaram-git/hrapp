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


const UserAccountDetailSection = (props) => {
    const user = props.data.user;
    console.log("user::"+JSON.stringify(user))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs'>
                        Account Details
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
                                Account Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.userAccountName}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile" width="project.details.column1">
                                Account Type
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.userAccountType}
                                </Text>
                            </Th>
                        </Tr>                        
                        <Tr >
                            <Th bgColor="table_tile" width="project.details.column1">
                                Vendor Name
                            </Th>
                            <Th>
                                {user.userVendors?.map((vendor) =>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                       {vendor.vendor?.name}
                                    </Text>                            
                                )}
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

export default UserAccountDetailSection;
