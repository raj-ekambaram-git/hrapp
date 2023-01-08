import {MODE_EDIT} from "../../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InvoiceAddEdit from "../../../../components/account/invoiceAddEdit";


const EditInvoice = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);

  console.log("Edit User::"+JSON.stringify(props))
  
  const invoiceId = props.data.invoiceId;
  const requestData = {
    mode: MODE_EDIT,
    invoiceId: invoiceId,
    isVendor: isVendor
  }
  
    return (
      <div className="main__container">
          <InvoiceAddEdit data={requestData}/>
      </div>
    );
  };
export default EditInvoice;



export async function getStaticPaths() {

  return {
    paths: [{ params: { invoiceId: "5" } }],
    fallback: false,
  };

} 

export async function getStaticProps(context) {
  console.log("Static prosp::"+JSON.stringify(context))
  
  const { invoiceId } = context.params;
  return {
    props: {
      data: {
        invoiceId: invoiceId
      },
    },
    revalidate: 1,
  };
}