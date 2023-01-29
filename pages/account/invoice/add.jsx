import InvoiceAddEdit from "../../../components/account/invoiceAddEdit";
import {MODE_ADD, EMPTY_STRING} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const AddNewInvoice = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);
  const [vendorId, setVendorId] = useState(true);

  useEffect(() => {
    setVendor(router.query.vendor)
    setVendorId(router.query.vendorId)
  }, [router.query]);

const requestData = {
  mode: MODE_ADD,
  vendorId: vendorId,
  invoiceId: "",
  isVendor: isVendor
}

  return (
        <InvoiceAddEdit data={requestData}/>
  );
};

export default AddNewInvoice;


