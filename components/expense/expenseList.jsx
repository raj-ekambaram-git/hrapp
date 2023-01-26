import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch } from "react-redux";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { setSelectedExpenseId } from "../../store/modules/Expense/actions";
import { ExpenseStatus } from "@prisma/client";
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteConfirmDialog from "../common/deleteConfirmDialog";



const ExpenseList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const { data } = props.userData;
  const { isManager } = props.userData;
  const [expenseList, setExpenseList] = useState([]);
  const expenseListRef = useRef([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => ExpenseConstants.EXPENSE_LIST_TABLE_META)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dialogRef = useRef("Delete");

  useEffect(() => {

    if(isManager) {
      //get API call with accountId and VendorId
      if(userService.isSuperAdmin()) {
        getExpenseList(data.userId, "NaN");
      }else {
        getExpenseList(data.userId, userService.getAccountDetails().accountId);
      }
      setPageAuthorized(true);
      
      
    }else {
      //Since this is just the account call only accountId
      if(userService.isSuperAdmin()) {
        getExpenseList(data.userId, "NaN");
      }else {
        getExpenseList(data.userId, userService.getAccountDetails().accountId);
      }
      
     setPageAuthorized(true);

    }

  }, []);
  
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getExpenseList(userId, accountId) {
      // setPageAuthorized(true);
      const responseData = await userService.getExpensesByUser(userId, accountId);

      if(responseData != undefined && responseData != EMPTY_STRING) {
        updateExpenseListForTable(responseData)
        expenseListRef.current = responseData;
      }
    }

    const updateExpenseListForTable = (responseData) => {
      const updatedExpenseList =  responseData.map((expense, index)=> {
        expense.deleteAction = <><HStack spacing={6}>{ (expense.status === ExpenseStatus.Draft || expense.status === ExpenseStatus.Saved  || expense.status === ExpenseStatus.Submitted )?(<DeleteIcon size="xs" onClick={() => handleExpenseDeleteSelection(expense.id)}/>):(<Box marginRight={3}></Box>)}<Box>{expense.id}</Box></HStack></>
        expense.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleExpenseSelection(expense.id)}>Details</Button>
        expense.projectName = expense?.project?.name;
        expense.lastUpdateDate = util.getFormattedDate(expense.lastUpdateDate)
        expense.createdDate = util.getFormattedDate(expense.createdDate)
        expense.approvedDate = util.getFormattedDate(expense.approvedDate)
        return expense;
      });
      setExpenseList(updatedExpenseList);

    }

    const handleExpenseDeleteSelection = (expenseId) => {
      dialogRef.current = expenseId;
      onOpen();
  
    }

    const handleDeleteConfirmation = async (expenseInput) => {
      // const responseData = await timesheetService.markTimesheetDelete(expenseInput.current, userService.getAccountDetails().accountId) 
      const responseData = []
      if(responseData.error) {
        toast({
          title: 'Delete Timesheet.',
          description: 'Error deleting timesheet',
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
      }else {
        toast({
          title: 'Delete Timesheet.',
          description: 'Successfully deleted timesheet.',
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
        const newExpenseList = [...expenseListRef.current]
        const expenseToRemoveIndex = newExpenseList.findIndex(x => x.id === expenseInput.current);
        newExpenseList.splice(expenseToRemoveIndex, 1);
        updateExpenseListForTable(newExpenseList)
        expenseListRef.current = newExpenseList;
        onClose()
      }
    }
    

    
    function handleExpenseSelection(expenseId){
      dispatch(setSelectedExpenseId(expenseId))
      router.push("/expense");
    }
  
    function handleAddNewExpense() {
      router.push({ pathname: '/expense/add', query: { manager: isManager }});
    }
  
  

  return (

    <div>
      {isPageAuthprized ? (
        <div>
              {isManager ? (
                <PageMainHeader heading="Expenses to Approve"/>
              ) : (
                <PageMainHeader heading="Expenses"/>
              )}
              <DeleteConfirmDialog        
                  deleteHeader="Delete Expense"
                  dialogRef={dialogRef}
                  isOpen={isOpen}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                  onClose={onClose}/>

              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <Button size="xs" bgColor="header_actions"   onClick={handleAddNewExpense}>
                        Add New Expense
                    </Button>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable variant="sortTable" columns={EXPENSE_LIST_TABLE_COLUMNS} rows={expenseList} />
          </div>
      ) : (
        <> 
        <PageNotAuthorized/>
        </>
      ) }
      </div>    
  );
};

export default ExpenseList;
