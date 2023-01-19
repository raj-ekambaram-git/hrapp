import { useSelector } from "react-redux";
import UserList from "../../components/user/userList";
import { userService } from "../../services";


export default function Home(props) {
  const accountId = useSelector(state => state.account.selectedAccountId);

  const data = {
    action: "accountUserList",
    accountId: accountId? accountId : userService.getAccountDetails().accountId
  }

  return (
    <UserList userList={{ data: data, isVendor: false }} /> 
  );
}
