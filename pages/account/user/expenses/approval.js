import React from "react";
import { useSelector } from "react-redux";
import ExpenseApprovalList from "../../../../components/expense/expenseApprovalList";



export default function TimesheetApproval(props) {

  const userId = useSelector(state => state.user.loggedInUser?.id);

  const data = {
    action: "userExpenseApprovalList",
    userId: userId
  }
  return (
    <ExpenseApprovalList userData={{ data: data, isManager: true, isApprovalList: true }} /> 
  );
}
