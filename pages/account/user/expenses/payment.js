import React from "react";
import ExpensePaymentList from "../../../../components/expense/payment/expensePaymentList";
import { userService } from "../../../../services";




export default function ExpensePayment(props) {

  // const userId = useSelector(state => state.user.loggedInUser?.id);
  const userId = userService?.userValue?.id;

  const data = {
    action: "userExpensePaymentList",
    userId: userId
  }
  return (
    <ExpensePaymentList userData={{ data: data, isManager: true, isPaymentList: true }} /> 
  );
}
