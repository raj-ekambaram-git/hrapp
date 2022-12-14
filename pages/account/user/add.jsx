import UserAddEdit from "../../../components/account/userAddEdit";
import {MODE_ADD, EMPTY_STRING} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const AddNewUser = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  useEffect(() => {
    console.log("inside AddNewUser isVendor Flag"+router.query.vendor); 
    setVendor(router.query.vendor)
  }, [router.query]);

const requestData = {
  mode: MODE_ADD,
  userId: "",
  isVendor: isVendor
}

  return (
    <div className="main__container">
        <UserAddEdit data={requestData}/>
    </div>
  );
};

export default AddNewUser;


