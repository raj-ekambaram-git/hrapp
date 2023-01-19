import { useSelector } from "react-redux";
import InvoiceList from "../../components/invoice/invoiceList";
import { userService } from "../../services";

export default function Home(props) {
  const accountId = useSelector(state => state.account.selectedAccountId);
  const data = {
    action: "accountInvoiceList",
    accountId: accountId? accountId : userService.getAccountDetails().accountId
  }

  return (
    <InvoiceList invoiceList={{ data: data, requestMode: "ACCOUNT" }} /> 
  );
}
