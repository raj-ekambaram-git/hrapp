import VendorAddEdit from "../../../../components/account/vendorAddEdit";
import {MODE_EDIT} from "../../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const EditVendor = (props) => {
  const router = useRouter();

  const vendorId = props.data.vendorId;
  const requestData = {
    mode: MODE_EDIT,
    vendorId: vendorId
  }
  
    return (
      <div className="main__container">
          <VendorAddEdit data={requestData}/>
      </div>
    );
  };
export default EditVendor;



export async function getStaticPaths() {

  return {
    paths: [{ params: { vendorId: "5" } }],
    fallback: false,
  };

} 

export async function getStaticProps(context) {
  const { vendorId } = context.params;
  return {
    props: {
      data: {
        vendorId: vendorId
      },
    },
    revalidate: 1,
  };
}