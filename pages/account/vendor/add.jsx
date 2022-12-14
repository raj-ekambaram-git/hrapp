import VendorAddEdit from "../../../components/account/vendorAddEdit";
import {MODE_ADD, EMPTY_STRING} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const AddNewVendor = (props) => {
  const router = useRouter();

  const requestData = {
    mode: MODE_ADD,
    vendorId: ""
  }

  return (
    <div className="main__container">
        <VendorAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewVendor;


