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
import { EMPTY_STRING,} from "../../../constants/accountConstants";
import { useDispatch } from "react-redux";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";
import { ExpenseConstants, NotesConstants } from "../../../constants";
import NotesHistory from "../../notes/notesHistory";
import { setNotesType } from "../../../store/modules/Notes/actions";
import { CustomTable } from "../../customTable/Table";




  const ExpenseEntryDetail = (props) => {
    const expense = props.expense;
    const dispatch = useDispatch();
    const [size, setSize] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showErrorMessage, setShowErrorMessage] = useState(EMPTY_STRING);
    const EXPENSE_ENTRY_LIST_TABLE_COLUMNS = React.useMemo(() => ExpenseConstants.EXPENSE_ENTRY_LIST_TABLE_META)
    
    const notesData = {
        type: NotesConstants.NOTES_TYPE.Expense,
        typeId: parseInt(expense.id),
        typeName: expense.name
      }

    useEffect(() => {
        
      }, []);

    async function updateExpense(expenseId,status) {
        console.log("updateExpense::::"+status);
        // if(timesheetEntryNote != undefined && timesheetEntryNote != EMPTY_STRING && timesheetEntryNote != DEFAULT_NOTES) {
        //     setShowErrorMessage(EMPTY_STRING);
        //     const timesheetEntryUpdateResponse = await timesheetService.updateTimesheetEntry(timesheetEntryId, status, timesheetEntryNote);    
        //     console.log("timesheetEntryUpdateResponse::"+JSON.stringify(timesheetEntryUpdateResponse));
        //     if(timesheetEntryUpdateResponse.error) {
        //         setShowErrorMessage("Error Updating timesheet entry");
        //     }else {
        //         dispatch(fetchTimesheetsForApproval(userService.userValue?.id, userService.getAccountDetails().accountId));
        //         setTimesheetEntryNote(EMPTY_STRING);
        //         onClose();
        //         //Remove the item from the list
        //     }
    
        // }else {
        //     setShowErrorMessage("Notes are required.");
        //     onOpen();
        // }
        
    }



    const handleClick = (newSize) => {
        setSize(newSize)
        onOpen()
        dispatch(setNotesType(notesData))
      }

    return (
        <div>
            <Button size="xs" bgColor="header_actions"
                onClick={() => handleClick("xl")}
                key="xl"
                m={1}
                >{`Approve / Reject`}
            </Button>
            <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    {expense?.name} of {expense?.user?.firstName} {expense?.user?.lastName}
                </DrawerHeader>                    
                <DrawerBody>
                    <ShowInlineErrorMessage showErrorMessage={showErrorMessage}/>
                    <CustomTable  variant="sortTable" columns={EXPENSE_ENTRY_LIST_TABLE_COLUMNS} rows={expense?.expenseEntries} />
                    <Box>
                        <Heading as="h3" size="sm" marginBottom="1rem"> 
                            Add Comment
                        </Heading>

                        <Textarea placeholder='Please add comment' onChange={(ev) => setTimesheetEntryNote(ev.target.value)} />
                    </Box>
                    

                    <HStack marginTop="3rem">
                        <Box marginRight="1rem">
                            <Button size="xs" onClick={() => updateTimesheetEntry(expense.id,ExpenseConstants.EXPENSE_STATUS.Approved)} bgColor="timesheet.approved_status">
                                Approve
                            </Button>
                        </Box>
                        <Box>
                            <Button size="xs"  onClick={() => updateTimesheetEntry(expense.id,ExpenseConstants.EXPENSE_STATUS.Rejected)} bgColor="timesheet.rejected_status">
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


export default ExpenseEntryDetail;