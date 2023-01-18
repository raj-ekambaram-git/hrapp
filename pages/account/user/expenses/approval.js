import React from "react";
import { useSelector } from "react-redux";
import ExpenseApprovalList from "../../../../components/expense/approval/expenseApprovalList";
import { userService } from "../../../../services";



export default function TimesheetApproval(props) {

  // const userId = useSelector(state => state.user.loggedInUser?.id);
  const userId = userService.userValue.id;

  const data = {
    action: "userExpenseApprovalList",
    userId: userId
  }
  return (
    <ExpenseApprovalList userData={{ data: data, isManager: true, isApprovalList: true }} /> 
  );
}
