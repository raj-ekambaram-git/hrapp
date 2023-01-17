import {MODE_EDIT} from "../../constants/accountConstants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ExpenseAddEdit from "../../components/expense/expenseAddEdit";



const EditTimesheet = (props) => {
  const router = useRouter();

  const expenseId = useSelector(state => state.expense.selectedExpenseId);
  console.log("expenseId::"+expenseId)
  const requestData = {
    mode: MODE_EDIT,
    expenseId: expenseId
  }
  
    return (
      <div className="main__container">
          <ExpenseAddEdit data={requestData}/>
      </div>
    );
  };
export default EditTimesheet;
