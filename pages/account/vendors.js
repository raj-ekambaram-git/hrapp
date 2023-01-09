
import { useSelector } from "react-redux";
import VendorList from "../../components/vendor/vendorList";
import { userService } from "../../services";

export default function Vendors(props) {
  const accountId = useSelector(state => state.account.selectedAccountId);

  const data  = {
    action: "accountVendorList",
    accountId: accountId
  }

  return (
    <VendorList vendorList={{ data: data }} /> 
  );

}
