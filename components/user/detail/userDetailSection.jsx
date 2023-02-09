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
  AccordionPanel,
  Badge

} from '@chakra-ui/react';


const UserDetailSection = (props) => {
    const user = props.data.user;
    console.log("user::"+JSON.stringify(user))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                    <Heading size='xs'>
                        User Details
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
                                ID
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.id}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                First Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.firstName}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile">
                                Last Name
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.lastName}
                                </Text>
                            </Th>
                        </Tr>      
                        <Tr >
                            <Th bgColor="table_tile">
                                Status
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    <Badge color={`${
                                            user.userStatus === "Active"
                                            ? "paid_status"
                                            : user.userStatus === "Inactive"
                                            ? "pending_status"
                                            : "pending_status"
                                        }`}>{user.userStatus}
                                    </Badge> 
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

export default UserDetailSection;
