import VendorAddEdit from "../../../components/account/vendorAddEdit";
import {MODE_EDIT} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";


const EditVendor = (props) => {
  const router = useRouter();

  const vendorId = useSelector(state => state.vendor.selectedVendorId);

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
