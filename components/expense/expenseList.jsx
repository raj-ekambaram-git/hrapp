import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react'
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch } from "react-redux";
import { setnewTSWeekStartDimId, setSelectedTimesheetId } from "../../store/modules/Timesheet/actions";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";
import { EMPTY_STRING, ExpenseConstants } from "../../constants";
import { setSelectedExpenseId } from "../../store/modules/Expense/actions";



const ExpenseList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = props.userData;
  const { isManager } = props.userData;
  const [expenseList, setExpenseList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const EXPENSE_LIST_TABLE_COLUMNS = React.useMemo(() => ExpenseConstants.EXPENSE_LIST_TABLE_META)

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
        const updatedExpenseList =  responseData.map((expense, index)=> {
          expense.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleExpenseSelection(expense.id)}>Details</Button>
          expense.projectName = expense?.project?.name;
          expense.lastUpdateDate = util.getFormattedDate(expense.lastUpdateDate)
          expense.createdDate = util.getFormattedDate(expense.createdDate)
          expense.approvedDate = util.getFormattedDate(expense.approvedDate)
          return expense;
        });
        setExpenseList(updatedExpenseList);
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
