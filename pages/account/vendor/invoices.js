
import { useSelector } from "react-redux";
import InvoiceList from "../../../components/invoice/invoiceList";


export default function VendorInvoices(props) {
  
  const vendorId = useSelector(state => state.vendor.selectedVendorId);

  const data = {
    action: "vendorInvoiceList",
    vendorId: vendorId
  }

  return (
    <InvoiceList invoiceList={{ data: data, requestMode: "VENDOR" }} /> 
  );
}

