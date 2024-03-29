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
    Textarea,
  } from '@chakra-ui/react';
import { DEFAULT_NOTES, EMPTY_STRING,} from "../../../constants/accountConstants";
import { useDispatch } from "react-redux";
import { ShowInlineErrorMessage } from "../../common/showInlineErrorMessage";
import { ExpenseConstants, NotesConstants } from "../../../constants";
import NotesHistory from "../../notes/notesHistory";
import { setNotesType } from "../../../store/modules/Notes/actions";
import { fetchExpensesForApproval } from "../../../store/modules/Expense/actions";
import { CustomTable } from "../../customTable/Table";
import { expenseService, userService } from "../../../services";




  const ExpenseEntryDetail = (props) => {
    const expense = props.expense;
    const dispatch = useDispatch();
    const [size, setSize] = useState(EMPTY_STRING)
    const [expenseNote, setExpenseNote] = useState(EMPTY_STRING)
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
        if(expenseNote != undefined && expenseNote != EMPTY_STRING && expenseNote != DEFAULT_NOTES) {
            setShowErrorMessage(EMPTY_STRING);
            const expenseUpdateResponse = await expenseService.handleExpenseApproval(expenseId, status, expenseNote,userService.userValue?.id);
            if(expenseUpdateResponse.error) {
                setShowErrorMessage("Error Updating expense entry");
            }else {
                dispatch(fetchExpensesForApproval(userService.userValue?.id, userService.getAccountDetails().accountId));
                setExpenseNote(EMPTY_STRING);
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
                onClick={() => handleClick("xl")}
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
                    <CustomTable  variant="sortTable" columns={EXPENSE_ENTRY_LIST_TABLE_COLUMNS} rows={expense?.expenseEntries} disablePagination={true}/>
                    <Box marginTop="5rem">
                        <Heading as="h3" size="sm" marginBottom="1rem"> 
                            Add Comment
                        </Heading>
                        <Textarea placeholder='Please add comment' onChange={(ev) => setExpenseNote(ev.target.value)} />
                    </Box>
                    

                    <HStack marginTop="3rem">
                        <Box marginRight="1rem">
                            <Button size="xs" onClick={() => updateExpense(expense.id,ExpenseConstants.EXPENSE_STATUS.Approved)} bgColor="header_actions">
                                Approve
                            </Button>
                        </Box>
                        <Box>
                            <Button size="xs"  onClick={() => updateExpense(expense.id,ExpenseConstants.EXPENSE_STATUS.Rejected)} colorScheme="red">
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