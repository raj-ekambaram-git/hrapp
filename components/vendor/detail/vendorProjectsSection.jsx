import React from "react";
import Link from "next/link";
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
  HStack,
  Button,
  Badge
} from '@chakra-ui/react';
import { useDispatch } from "react-redux";
import { setSelectedProjectId } from "../../../store/modules/Project/actions";
import { useRouter } from "next/router";


const VendorProjectsSection = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const vendor = props.data.vendor;
    

    function handleProjectDetailSelection(projectId){
      dispatch(setSelectedProjectId(projectId))
      router.push("/account/project/detail");
    }

  return (

    <div>

        <AccordionItem>
            <h2>
            <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                <Heading size='xs' textTransform='uppercase'>
                    Projects
                </Heading>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                {vendor.project ? (
                    <>
                    <TableContainer>
                        <Table>
                        <TableCaption></TableCaption>
                        <Thead>
                            <Tr bgColor="inner_table_tile">
                                <Th>
                                     ID
                                </Th>
                                <Th>
                                     Name
                                </Th>
                                <Th>
                                     Type
                                </Th>                                    
                                <Th>
                                     Status
                                </Th>
                            </Tr>   
                            </Thead>                
                            <Tbody>
                            {vendor.project?.map((proj) => (
                                <Tr>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>  
                                            {proj.id}
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>  
                                            {proj.name}
                                        </Text>
                                    </Th>
                                    <Th>
                                        <Text pt='table_display_value' fontSize='table_display_value'>  
                                            {proj.type}
                                        </Text>
                                    </Th>
                                    <Th>
                                        <HStack>
                                        <Button size="xs" bgColor="header_actions" 
                                            onClick={() => handleProjectDetailSelection(proj.id)}
                                            >Details
                                        </Button>
                                        <Badge color={`${
                                            proj.status === "Active"
                                                ? "paid_status"
                                                : proj.status === "Inactive"
                                                ? "pending_status"
                                                : "pending_status"
                                            }`}>{proj.status}</Badge>
                                        </HStack>
                                    </Th>
                                    
                                </Tr>

                            ))}
                        </Tbody>    
                        </Table>
                    </TableContainer>                        
                    </>
                ) : (
                    <>
                    </>
                )} 
            </AccordionPanel>
        </AccordionItem>        
        
 
    </div>


  );
};

export default VendorProjectsSection;
