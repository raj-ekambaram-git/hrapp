import { useSelector } from "react-redux";
import AccountAddEdit from "../../components/account/accountAddEdit";
import {MODE_EDIT} from "../../constants/accountConstants";


const EditAccount = (props) => {

  const accountId = useSelector(state => state.account.selectedAccountId);

  const requestData = {
    mode: MODE_EDIT,
    accountId: accountId
  }
  
    return (
      <div className="main__container">
          <AccountAddEdit data={requestData}/>
      </div>
    );
  };
export default EditAccount;
