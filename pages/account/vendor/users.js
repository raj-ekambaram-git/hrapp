import UserList from "../../../components/user/userList";
import React from "react";
import { useSelector } from "react-redux";

export default function VendorUsers(props) {
  const vendorId = useSelector(state => state.vendor.selectedVendorId);

  const data = {
    action: "vendorUserList",
    vendorId: vendorId
  }

  return (
        
    <UserList userList={{ data: data, isVendor: true }} /> 

  );
}
