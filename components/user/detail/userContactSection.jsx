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


const UserContactSection = (props) => {
    const user = props.data.user;
    console.log("user::"+JSON.stringify(user))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs' textTransform='uppercase'>
                        Contact Details
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
                                        {user.addressName} <br/>
                                        {user.address1} <br/>
                                        {user.address2 ? (
                                            <>
                                                {user.address2}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {user.address3 ? (
                                            <>
                                                {user.address3}<br/>
                                            </>
                                            ):(
                                            <>
                                            </>
                                            )} 
                                        {user.city}, {user.state} { user.zipCode}  <br/>
                                        {user.country} <br/>
                                    </Text>
                                </Th>
                            </Tr>       
                            <Tr >
                                <Th bgColor="table_tile" width="project.details.column1">
                                    Phone
                                </Th>
                                <Th>
                                    <Text pt='table_display_value' fontSize='table_display_value'>  
                                        {user.userPhone}
                                    </Text>
                                </Th>
                            </Tr>      
                        </Tbody>
                    </Table>
                </TableContainer>    
                <Box>
                    <Text>
                        Please contact account admin for updating the contact information.
                    </Text>
                </Box>
            </AccordionPanel>
        </AccordionItem>        

    </div>


  );
};

export default UserContactSection;
