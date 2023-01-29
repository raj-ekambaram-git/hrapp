import UserAddEdit from "../../../components/account/userAddEdit";
import {MODE_EDIT} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const EditUser = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  const userId = useSelector(state => state.user.selectedUserId);

  useEffect(() => {
    if(router.query && router.query.vendor) {
      setVendor(router.query.vendor)
    }
  }, [router.query]);
  
  const requestData = {
    mode: MODE_EDIT,
    userId: userId,
    isVendor: isVendor
  }
  
    return (
          <UserAddEdit data={requestData}/>
    );
  };
export default EditUser;
