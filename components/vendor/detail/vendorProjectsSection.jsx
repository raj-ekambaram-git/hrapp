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


const VendorProjectsSection = (props) => {
    const vendor = props.data.vendor;
    console.log("vendor::"+JSON.stringify(vendor))

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
                                    Projet ID
                                </Th>
                                <Th>
                                    Project Name
                                </Th>
                                <Th>
                                    Project Type
                                </Th>                                    
                                <Th>
                                    Project Status
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
                                        <Link href={`/account/project/${proj.id}/detail`} passref key={proj.id}>
                                            <Button className="btn">
                                            Details
                                            </Button>
                                        </Link>
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
