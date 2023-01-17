import React from "react";
import { useSelector } from "react-redux";
import ExpenseList from "../../../components/expense/expenseList";



export default function UserTimesheets(props) {
  const userId = useSelector(state => state.user.loggedInUser?.id);

  console.log("User Expensse::::"+userId)
  const data = {
    action: "userExpenseList",
    userId: userId
  }

  return (
        
    <ExpenseList userData={{ data: data, isManager: false }} /> 

  );
}