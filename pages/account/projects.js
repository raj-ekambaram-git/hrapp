
import { useSelector } from "react-redux";
import ProjectList from "../../components/project/projectList";


export default function Vendors(props) {
  const accountId = useSelector(state => state.account.selectedAccountId);

  const data = {
    action: "accountProjectList",
    accountId: accountId,
    vendorId: "NaN"
  }

  return (
    <ProjectList projectList={{ data: data, isVendor: false }} /> 
  );

}
