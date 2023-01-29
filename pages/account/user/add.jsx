import UserAddEdit from "../../../components/account/userAddEdit";
import {EMPTY_STRING, MODE_ADD} from "../../../constants/accountConstants";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const AddNewUser = (props) => {
  const router = useRouter();
  const [isVendor, setVendor] = useState(true);

  useEffect(() => {
    setVendor(router.query.vendor)
  }, [router.query]);

const requestData = {
  mode: MODE_ADD,
  userId: EMPTY_STRING,
  isVendor: isVendor
}

  return (
        <UserAddEdit data={requestData}/>
  );
};

export default AddNewUser;


