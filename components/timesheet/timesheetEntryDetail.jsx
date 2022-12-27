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
    const tsEntryDetail = props.tsEntryDetail;
    // const 
    const [size, setSize] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [timesheetEntryNote, setTimesheetEntryNote] = useState("");
    const [timesheetEntryDetail, setTimesheetEntryDetail] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        console.log("props.tsEntryDetail:::"+JSON.stringify(tsEntryDetail));
        if(tsEntryDetail) {
            console.log("Inside the tsEntryDetail")
            setTimesheetEntryDetail(tsEntryDetail);
        }
    
      }, []);

    async function updateTimesheetEntry(timesheetEntryId,status) {
        console.log("updateTimesheetEntry::::"+status);
        const timesheetEntryUpdateResponse = await timesheetService.updateTimesheetEntry(timesheetEntryId, status, "timesheetEntryNote");    
        console.log("timesheetEntryUpdateResponse::"+JSON.stringify(timesheetEntryUpdateResponse));
        if(timesheetEntryUpdateResponse.error) {
            setShowErrorMessage(true);
        }else {
            onClose();
        }
        
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
                        {tsEntryDetail.timesheet.name}
                    </Heading>
                    <Heading as="h3" size="md">
                        {tsEntryDetail.timesheet.user.firstName} {tsEntryDetail.timesheet.user.lastName}
                    </Heading>
                    {showErrorMessage ? (
                        <>
                        <Text>Not able to approve.</Text>
                        </>
                    ) : (
                        <>
                        </>
                    )}
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
                                    {tsEntryDetail.entries.day1.hours ? tsEntryDetail.entries.day1.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day2.hours ? tsEntryDetail.entries.day2.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day3.hours ? tsEntryDetail.entries.day2.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day4.hours ? tsEntryDetail.entries.day4.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day5.hours ? tsEntryDetail.entries.day5.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day6.hours ? tsEntryDetail.entries.day6.hours+ " hrs" : "0 hrs"} 
                                </Th>
                                <Th>
                                    {tsEntryDetail.entries.day7.hours ? tsEntryDetail.entries.day7.hours+ " hrs" : "0 hrs"} 
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
                        <Button className="btn" onClick={() => updateTimesheetEntry(tsEntryDetail.id,TIMESHEET_STATUS.Approved)} bgColor="timesheet.approved_status">
                            Approve
                        </Button>
                    </Box>
                    <Box>
                        <Button className="btn" onClick={() => updateTimesheetEntry(tsEntryDetail.id,TIMESHEET_STATUS.Rejected)} bgColor="timesheet.rejected_status">
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