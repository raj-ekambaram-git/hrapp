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
  Accordion,
} from '@chakra-ui/react';
import {
    AddIcon
  } from '@chakra-ui/icons';

const ProjectTimesheeEntryDetail = (props) => {
    const timesheetEntries = props.data;
    console.log("ProjectTimesheeEntryDetail::"+JSON.stringify(timesheetEntries))

  return (

    <div>
        <Accordion>
            <AccordionItem marginBottom="1rem" border="1px" width="60%">
                <h2>
                    <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                        <AddIcon/>
                    </Box>
                    <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <TableContainer  marginTop="2rem">
                        <Table>
                            <TableCaption></TableCaption>
                            <Thead>
                                <Tr bgColor="table_tile">
                                    <Th>
                                        Day1
                                    </Th>
                                    <Th>
                                        Day2
                                    </Th>
                                    <Th>
                                        Day3
                                    </Th>
                                    <Th>
                                        Day4
                                    </Th>
                                    <Th>
                                        Day5
                                    </Th>
                                    <Th>
                                        Day6
                                    </Th>
                                    <Th>
                                        Day7
                                    </Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                            <Tr>
                                <Th>
                                    {timesheetEntries.day1.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day2.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day3.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day4.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day5.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day6.hours}
                                </Th>
                                <Th>
                                    {timesheetEntries.day7.hours}
                                </Th>

                            </Tr>                                                                                                        
                            </Tbody>
                        </Table>
                    </TableContainer>   
                </AccordionPanel>
            </AccordionItem>
        </Accordion>            
    </div>


  );
};

export default ProjectTimesheeEntryDetail;
