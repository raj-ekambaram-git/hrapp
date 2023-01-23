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
    Textarea,
    Text,
    Tooltip
  } from '@chakra-ui/react';
import { EMPTY_STRING, TIMESHEET_STATUS, DEFAULT_NOTES } from "../../constants/accountConstants";
import { timesheetService, userService} from "../../services";
import {util} from '../../helpers/util';
import { TimesheetHeader } from "./timesheetHeader";
import { useDispatch } from "react-redux";
import { fetchTimesheetsForApproval } from "../../store/modules/Timesheet/actions";
import { ShowInlineErrorMessage } from "../common/showInlineErrorMessage";
import { NotesConstants } from "../../constants";
import NotesHistory from "../notes/notesHistory";
import { setNotesType } from "../../store/modules/Notes/actions";




  const TimesheetEntryDetail = (props) => {
    const tsEntryDetail = props.tsEntryDetail;
    const dispatch = useDispatch();
    const [size, setSize] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [timesheetEntryNote, setTimesheetEntryNote] = useState(DEFAULT_NOTES);
    const [timesheetEntryDetail, setTimesheetEntryDetail] = useState({});
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);

    const notesData = {
        type: NotesConstants.NOTES_TYPE.TimesheetEntry,
        typeId: parseInt(tsEntryDetail.id),
        typeName: NotesConstants.NOTES_TYPE.Timesheet
      }

    useEffect(() => {

        if(tsEntryDetail) {
            console.log("Inside the tsEntryDetail")
            setTimesheetEntryDetail(tsEntryDetail);
        }
    
      }, []);

    async function updateTimesheetEntry(userId, timesheetEntryId,status, billable) {
        console.log("updateTimesheetEntry::::"+userId);
        if(timesheetEntryNote != undefined && timesheetEntryNote != EMPTY_STRING && timesheetEntryNote != DEFAULT_NOTES) {
            setShowErrorMessage(EMPTY_STRING);
            const timesheetEntryUpdateResponse = await timesheetService.updateTimesheetEntry(userId, billable, timesheetEntryId, status, timesheetEntryNote, userService.userValue.id);    
            console.log("timesheetEntryUpdateResponse::"+JSON.stringify(timesheetEntryUpdateResponse));
            if(timesheetEntryUpdateResponse.error) {
                setShowErrorMessage("Error Updating timesheet entry");
            }else {
                dispatch(fetchTimesheetsForApproval(userService.userValue?.id, userService.getAccountDetails().accountId));
                setTimesheetEntryNote(EMPTY_STRING);
                onClose();
                //Remove the item from the list
            }
    
        }else {
            setShowErrorMessage("Notes are required.");
            onOpen();
        }
        
    }



    const handleClick = (newSize) => {
        setSize(newSize)
        onOpen()
        dispatch(setNotesType(notesData))
      }

    return (
        <div>
            <Button size="xs" bgColor="header_actions"
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
                    {tsEntryDetail.timesheet?.name} of {tsEntryDetail.timesheet?.user?.firstName} {tsEntryDetail.timesheet?.user?.lastName}
                </DrawerHeader>                    
                <DrawerBody>
                    <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                <TableContainer display="flex">
                    <Table>
                        <TableCaption></TableCaption>
                        <Thead>
                            <Tr bgColor="table_tile">
                                <Th>
                                    <TimesheetHeader day="Mon" date={util.getDayMonthFormat(tsEntryDetail.entries?.day1?.date)}/>
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Tue" date={util.getDayMonthFormat(tsEntryDetail.entries?.day2?.date)}/>                                
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Wed" date={util.getDayMonthFormat(tsEntryDetail.entries?.day3?.date)}/>                                
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Thu" date={util.getDayMonthFormat(tsEntryDetail.entries?.day4?.date)}/>                                
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Fri" date={util.getDayMonthFormat(tsEntryDetail.entries?.day5?.date)}/>                                
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Sat" date={util.getDayMonthFormat(tsEntryDetail.entries?.day6?.date)}/>                                
                                </Th>
                                <Th>
                                    <TimesheetHeader day="Sun" date={util.getDayMonthFormat(tsEntryDetail.entries?.day7?.date)}/>                                
                                </Th>                                
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day1?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day1?.hours ? tsEntryDetail.entries?.day1?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day2?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day2?.hours ? tsEntryDetail.entries?.day2?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day3?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day3?.hours ? tsEntryDetail.entries?.day2?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day4?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day4?.hours ? tsEntryDetail.entries?.day4?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day5?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day5?.hours ? tsEntryDetail.entries?.day5?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day6?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day6?.hours ? tsEntryDetail.entries?.day6?.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
                                </Th>
                                <Th>
                                    <Tooltip label={tsEntryDetail.entries?.day7?.note} maxWidth="timesheet.note_hover_width">
                                        {tsEntryDetail.entries?.day7?.hours ? tsEntryDetail.entries.day7.hours+ " hrs" : "0 hrs"} 
                                    </Tooltip>
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
                        <Button size="xs" onClick={() => updateTimesheetEntry(tsEntryDetail.timesheet?.userId,tsEntryDetail.id,TIMESHEET_STATUS.Approved)} bgColor="timesheet.approved_status">
                            Approve
                        </Button>
                    </Box>
                    <Box>
                        <Button size="xs"  onClick={() => updateTimesheetEntry(tsEntryDetail.timesheet?.userId,tsEntryDetail.id,TIMESHEET_STATUS.Rejected)} bgColor="timesheet.rejected_status">
                            Reject
                        </Button>
                    </Box>
                    <NotesHistory/>                    
                </HStack>
                    
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};


export default TimesheetEntryDetail;