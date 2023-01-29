import AccountAddEdit from "../../../components/account/accountAddEdit";
import {MODE_ADD, EMPTY_STRING} from "../../../constants/accountConstants";

const AddNewAccount = () => {

const requestData = {
  mode: MODE_ADD,
  accountId: ""
}

  return (
        <AccountAddEdit data={requestData}/>
  );
};

export default AddNewAccount;
