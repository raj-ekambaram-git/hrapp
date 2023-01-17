import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "../../services";
import {MODE_ADD} from "../../constants/accountConstants";
import { PageNotAuthorized } from "../common/pageNotAuthorized";
import {
  Box,
  useToast
} from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux";
import { PageMainHeader } from "../common/pageMainHeader";
import { ExpenseConstants, NotesConstants } from "../../constants";
import ExpenseEntry from "./expenseEntry";
import { setExpenseEntries, setExpenseHeader } from "../../store/modules/Expense/actions";


const ExpenseAddEdit = (props) => {
  
  const expenseId = props.data.expenseId;
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [isPageSectionAuthorized, setPageSectionAuthorized] = useState(false);
  const [isAddMode, setAddMode] = useState(true);
  

  const notesData = {
    type: NotesConstants.NOTES_TYPE.Expense,
    typeId: parseInt(expenseId),
    typeName: NotesConstants.NOTES_TYPE.Expense
  }

  //Get Account Details only if its EditMode
  useEffect(() => {
    if(props && props.data && props.data.mode != MODE_ADD) {
      setAddMode(false);  
    }

    if(userService.isAccountAdmin() || userService.isSuperAdmin() || userService.isTimesheetEntryUser() || userService.isManager()) {
      setPageAuthorized(true);
    }
    dispatch(setExpenseEntries([{...ExpenseConstants.EXPENSE_ENYTY_DEFAULT_RECORD}]))
    dispatch(setExpenseHeader({}))
  }, []);


  const expenseEntries = useSelector(state => state.expense.expenseEntries);
  console.log("expenseEntries ::"+JSON.stringify(expenseEntries));



  return (
    <div>
      {isPageAuthprized ? (
        <div> 
          {isAddMode ? (
              <PageMainHeader heading="New Expense"/>
          ) : (
              <PageMainHeader heading="Update Expense" notesData={notesData}/>
          )}              
          <Box width="100%">
            <ExpenseEntry data={{userId: userService.userValue.id, expenseId: expenseId, isAddMode: isAddMode}}></ExpenseEntry>
          </Box>

        </div>
      ) : (
        <> 
            <PageNotAuthorized/>
        </>
      )}
    </div>

  );
};

export default ExpenseAddEdit;
