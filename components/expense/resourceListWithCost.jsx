import React, { useEffect } from "react";
import { Tr, Th, Td, Table, Thead,Tbody, Radio, Box, RadioGroup, Stack } from "@chakra-ui/react";
import { util } from "../../helpers";
import { useState } from "react";

export default function ResourceListWithCost(props) {
  const [value, setValue] =useState()
  useEffect(() => {
  }, [props.resourceListWithCost]);
  
  const handleUserSelecction = (selectedUserId) => {
    console.log("handleUserSelecction:::"+selectedUserId)
  }

  return (
    <>    

      <RadioGroup onChange={handleUserSelecction} value={value}>
        <Stack spacing={5}>
         {props.resourceListWithCost?.map((resource) => (                
          <Radio colorScheme='blue' value={resource.user?.id}>
            {resource.user?.firstName} {resource.user?.firstName} -- {util.getWithCurrency(resource.cost)} / hour
          </Radio>          
          ))}
        </Stack>
      </RadioGroup>
          {/* <Table variant="reportTableList" colorScheme="teal">
            <Thead position="sticky" top={0}>
              <Tr>
                <Th colSpan={3} textAlign="center">Select Resource</Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.resourceListWithCost?.map((resource) => (                
                <Tr>
                  <Td><Radio value={resource.user?.id}></Radio></Td>
                  <Td>
                    {resource.user?.firstName} {resource.user?.lastName}
                  </Td>
                  <Td>
                    {util.getWithCurrency(resource.cost)} / hour
                  </Td>
                </Tr>                
              ))}
            </Tbody>
          </Table> */}
    </>
  );
}
