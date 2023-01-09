import InvoiceList from "../../../components/invoice/invoiceList";

export default function Home(props) {
  const accountId = useSelector(state => state.account.selectedAccountId);
  const data = {
    action: "accountInvoiceList",
    accountId: accountId
  }

  return (
    <InvoiceList invoiceList={{ data: data, requestMode: "ACCOUNT" }} /> 
  );
}
