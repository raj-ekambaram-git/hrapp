import {MODE_EDIT} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InvoiceAddEdit from "../../../components/account/invoiceAddEdit";
import { useSelector } from "react-redux";


const EditInvoice = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  const invoiceId = useSelector(state => state.invoice.selectedInvoiceId);

  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);

  const requestData = {
    mode: MODE_EDIT,
    invoiceId: invoiceId,
    isVendor: isVendor
  }
  
    return (
          <InvoiceAddEdit data={requestData}/>
    );
  };
export default EditInvoice;

