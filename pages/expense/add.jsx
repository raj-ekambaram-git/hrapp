import {MODE_ADD, EMPTY_STRING} from "../../constants/accountConstants";
import { useRouter } from "next/router";
import React from "react";
import ExpenseAddEdit from "../../components/expense/expenseAddEdit";


const AddNewExpense = (props) => {
  const router = useRouter();

  const requestData = {
    mode: MODE_ADD,
    expenseId: EMPTY_STRING
  }

  return (
    <div className="main__container">
        <ExpenseAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewExpense;


