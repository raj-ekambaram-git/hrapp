import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    useDisclosure,
    Button,
    DrawerBody,
    Heading,
    HStack,
    Box,
    Tr,
    Th,
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tbody,
    Textarea

  } from '@chakra-ui/react';
import { TIMESHEET_STATUS } from "../../constants/accountConstants";
import { timesheetService } from "../../services";

  const TimesheetEntryDetail = (props) => {

    // const 
    const [size, setSize] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [timesheetEntryNote, setTimesheetEntryNote] = useState("");
    const [timesheetEntryDetail, setTimesheetEntryDetail] = useState({});

    useEffect(() => {
        console.log("props.tsEntryDetail:::"+JSON.stringify(props.tsEntryDetail));
        if(props.tsEntryDetail) {
            console.log("Inside the props.tsEntryDetail")
            setTimesheetEntryDetail(props.tsEntryDetail);
        }
    
      }, []);

    async function updateTimesheetEntry(timesheetEntryId,status) {
        console.log("updateTimesheetEntry::::"+status);
        const timesheetEntryUpdateResponse = await timesheetService.updateTimesheetEntry(timesheetEntryId, status, "timesheetEntryNote");    
        console.log("timesheetEntryUpdateResponse::"+JSON.stringify(timesheetEntryUpdateResponse));

    }



    const handleClick = (newSize) => {
        setSize(newSize)
        onOpen()
      }

    return (
        <div>
            <Button
                onClick={() => handleClick("lg")}
                key="lg"
                m={1}
                >{`Approve / Reject`}
            </Button>

                        
                        
            <Drawer onClose={onClose} isOpen={isOpen} size="lg">
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    
                    <Heading as="h1" size="lg" letterSpacing={'-.1rem'} marginBottom="1rem">
                        {props.tsEntryDetail.timesheet.name}
                    </Heading>
                    <Heading as="h3" size="md">
                        {props.tsEntryDetail.timesheet.user.firstName} {props.tsEntryDetail.timesheet.user.lastName}
                    </Heading>

                </DrawerHeader>
                <DrawerBody>
                   
                <TableContainer display="flex">
                    <Table>
                        <TableCaption></TableCaption>
                        <Thead>
                            <Tr bgColor="table_tile">
                                <Th>
                                    1/1
                                </Th>
                                <Th>
                                    1/2
                                </Th>
                                <Th>
                                    1/3
                                </Th>
                                <Th>
                                    1/4
                                </Th>
                                <Th>
                                    1/1
                                </Th>
                                <Th>
                                    1/1
                                </Th>
                                <Th>
                                    1/1
                                </Th>                                
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Th>
                                    {props.tsEntryDetail.entries.day1.hours ? props.tsEntryDetail.entries.day1.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day2.hours ? props.tsEntryDetail.entries.day2.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day3.hours ? props.tsEntryDetail.entries.day2.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day4.hours ? props.tsEntryDetail.entries.day4.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day5.hours ? props.tsEntryDetail.entries.day5.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day6.hours ? props.tsEntryDetail.entries.day6.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {props.tsEntryDetail.entries.day7.hours ? props.tsEntryDetail.entries.day7.hours+ " hrs" : "0 hrs"} 
                                </Th>                                
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
                <Box>
                    <Heading as="h3" size="sm" marginBottom="1rem"> 
                        Add Comment
                    </Heading>

                    <Textarea placeholder='Please add comment' onChange={(ev) => setTimesheetEntryNote(ev.target.value)} />
                </Box>
                

                <HStack marginTop="3rem">
                    <Box marginRight="1rem">
                        <Button className="btn" onClick={() => updateTimesheetEntry(props.tsEntryDetail.id,TIMESHEET_STATUS.Approved)} bgColor="timesheet.approved_status">
                            Approve
                        </Button>
                    </Box>
                    <Box>
                        <Button className="btn" onClick={() => updateTimesheetEntry(props.tsEntryDetail.id,TIMESHEET_STATUS.Rejected)} bgColor="timesheet.rejected_status">
                            Reject
                        </Button>
                    </Box>

                </HStack>
                    
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};


export default TimesheetEntryDetail;