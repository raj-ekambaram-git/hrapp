
import { useSelector } from "react-redux";
import InvoiceList from "../../../components/invoice/invoiceList";


export default function ProjectInvoices(props) {
  const projectId = useSelector(state => state.project.selectedProjectId);
  
  const data = {
    action: "projectInvoiceList",
    projectId: projectId
  }
  return (
   <InvoiceList invoiceList={{ data: data, requestMode: "PROJECT" }} /> 
   
  );
}

