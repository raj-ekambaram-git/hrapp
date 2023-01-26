import React, { useEffect } from "react";
import { Box, Tr, Th, Td, Table, Thead,Tbody, Tooltip, Link, HStack } from "@chakra-ui/react";
import {FcViewDetails} from 'react-icons/Fc'

export default function ProjectsByStatusSummarySection(props) {
  
  useEffect(() => {
  }, [props.projects]);
  
  return (
    <>    
        <Box overflowY="auto" maxHeight="230px" border="1px">
          <Table variant="reportTableList" colorScheme="teal">
            <Thead position="sticky" top={0}>
              <Tr>
                <Th colSpan={3} textAlign="center"><Tooltip label="Click on a project for detailed project reports">Projects</Tooltip></Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.projects?.map(({ id, name, status }) => (
                <Tr>
                  <Td>{name}</Td>
                  <Td>
                    <HStack spacing={4}>
                      <Box>
                      {status}
                      </Box>
                    </HStack>
                     
                  </Td>
                  <Td>
                  <FcViewDetails size={20}/>
                  </Td>
                </Tr>                
              ))}
            </Tbody>
          </Table>
        </Box>
    </>
  );
}
