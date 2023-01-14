import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button
} from '@chakra-ui/react';
import ManageDocuments from "../../document/manageDocuments";



const UserDetailActions = (props) => {

  return (

    <div>
          <Flex marginBottom="1rem" borderRadius="lg" alignSelf="center">
                <HStack spacing={2}>
                  <Box>
                    <ManageDocuments/>
                  </Box>                                                 
                </HStack>
            </Flex>          
    </div>
  );
};

export default UserDetailActions;
