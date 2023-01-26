import React, { useEffect } from "react";
import { Box, Tr, Th, Td, Table, Thead,Tbody, Tooltip, Link, HStack } from "@chakra-ui/react";
import {FcViewDetails} from 'react-icons/fc'
import { useDispatch } from "react-redux";
import {setSelectedReportsTabIndex, setSelectedReportsVendorId} from '../../../store/modules/Reports/actions'
import { useRouter } from "next/router";

export default function VendorsByStatusSummarySection(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
  }, [props.vendors]);
  
  const handleDetailedVendorReport = (vendorId) => {
    dispatch(setSelectedReportsVendorId(vendorId))
    dispatch(setSelectedReportsTabIndex(1))
    router.push("/reports/dashboard");
}


  return (
    <>    
        <Box overflowY="auto" maxHeight="230px" border="1px">
          <Table variant="reportTableList" colorScheme="teal">
            <Thead position="sticky" top={0}>
              <Tr>
                <Th colSpan={3} textAlign="center"><Tooltip label="Click on a vendor for detailed reports">Vendors</Tooltip></Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.vendors.map(({ id, name, status }) => (
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
                    <FcViewDetails size={20} onClick={() => handleDetailedVendorReport(id)}/>
                  </Td>
                </Tr>                
              ))}
            </Tbody>
          </Table>
        </Box>
    </>
  );
}
