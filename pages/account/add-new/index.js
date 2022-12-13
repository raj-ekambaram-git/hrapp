import AccountAddEdit from "../../../components/common/accountAddEdit";
import {MODE_ADD, EMPTY_STRING} from "../../../constants/accountConstants";

const AddNewAccount = () => {

const requestData = {
  mode: MODE_ADD,
  accountId: ""
}

  return (
    <div className="main__container">
        <AccountAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewAccount;
