import React, { useEffect } from "react";
import { Tr, Th, Td, Table, Thead,Tbody, Radio, Box, RadioGroup, Stack } from "@chakra-ui/react";
import { util } from "../../helpers";
import { useState } from "react";

export default function ResourceListWithCost(props) {
  const [value, setValue] =useState()
  useEffect(() => {
  }, [props.resourceListWithCost]);
  
  return (
    <>    

      <RadioGroup onChange={props.handleUserSelecction} textTransform="none">
        <Stack spacing={5}>
         {props.resourceListWithCost?.map((resource) => (                
          <Radio colorScheme='blue' value={resource.user?.id+"_"+resource.cost}>
            <Box fontSize="13px">{resource.user?.firstName} {resource.user?.firstName} -- {util.getWithCurrency(resource.cost)}/hour</Box>
          </Radio>          
          ))}
        </Stack>
      </RadioGroup>
    </>
  );
}
