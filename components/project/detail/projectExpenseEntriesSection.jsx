import React from "react";
import {
  TableContainer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Table,
  Tbody,
  Thead,
  Th,
  Tr
} from '@chakra-ui/react';
import {
    AddIcon
  } from '@chakra-ui/icons';
  

const ProjectExpenseEntriesSection = (props) => {
    const timesheetEntries = props.data;
    const initialFocusRef = React.useRef();
    const tsEntriesArray = [timesheetEntries];
    console.log("ProjectTimesheeEntryDetail::"+JSON.stringify(tsEntriesArray))

  return (

    <div>

        <Popover
        initialFocusRef={initialFocusRef}
        placement='bottom'
        closeOnBlur={false}
        >
            <PopoverTrigger>
                <AddIcon/>
           </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    Entry Details
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <TableContainer  marginTop="2rem">
                        <Table>
                            <Thead>
                                <Tr bgColor="table_tile">
                                    <Th>
                                        Day
                                    </Th>
                                    <Th>
                                        Hours
                                    </Th>
                                    <Th>
                                        Date
                                    </Th>
                                    <Th>
                                        Notes
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                    <Tr>
                                        <Th>
                                            Day1
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.hours}
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.date}
                                        </Th>
                                        <Th>
                                            {timesheetEntries.day1.notes}
                                        </Th>                                                                                                            
                                    </Tr>
                                <Tr>
                                    <Th>
                                        Day2
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day2.notes}
                                    </Th>                                                                                                            
                                </Tr>
                                <Tr>
                                    <Th>
                                        Day3
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day3.notes}
                                    </Th>                                                                                                            
                                </Tr>
                                <Tr>
                                    <Th>
                                        Day4
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day4.notes}
                                    </Th>                                                                                                            
                                </Tr>
                                <Tr>
                                    <Th>
                                        Day5
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day5.notes}
                                    </Th>                                                                                                            
                                </Tr>
                                <Tr>
                                    <Th>
                                        Day6
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day6.notes}
                                    </Th>                                                                                                            
                                </Tr>
                                <Tr>
                                    <Th>
                                        Day7
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.hours}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.date}
                                    </Th>
                                    <Th>
                                        {timesheetEntries.day7.notes}
                                    </Th>                                                                                                            
                                </Tr>                                                                                                                                                                                                
                            </Tbody>
                        </Table>                        
                    </TableContainer>                       
                </PopoverBody>
            </PopoverContent>
        </Popover>        
    </div>


  );
};

export default ProjectExpenseEntriesSection;
