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
  Button,
  HStack

} from '@chakra-ui/react';
import UserChangePassword from "./userChangePassword";


const UserCredentialsSection = (props) => {
    const user = props.data.user;
    console.log("user::"+JSON.stringify(user))

  return (

    <div>
        <AccordionItem marginBottom="1rem" border="1px" width="60%">
            <h2>
                <AccordionButton bgColor="table_tile">
                <Box as="span" flex='1' textAlign='left'>
                        User Credentials
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
                                User Name/ Email
                            </Th>
                            <Th>
                                <Text pt='table_display_value' fontSize='table_display_value'>
                                    {user.userEmail}
                                </Text>
                            </Th>
                        </Tr>
                        <Tr >
                            <Th bgColor="table_tile" width="project.details.column1">
                                Password
                            </Th>
                            <Th>
                                <HStack spacing={8}>
                                    <Text pt='table_display_value' fontSize='table_display_value'>
                                        **********
                                    </Text>
                                    <Box>
                                        <Button className="btn">
                                            <UserChangePassword data={user}/>
                                        </Button>
                                    </Box>    
                                </HStack>                            
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

export default UserCredentialsSection;
