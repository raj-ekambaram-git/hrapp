import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { userService } from "../../services";


const AppSetting = (props) => {
  const router = useRouter();

  const userId = userService?.userValue?.id;

  useEffect(() => {

  }, []);


    return (
      <div className="main__container">
        App Config Setting
          {/* <InvoiceAddEdit data={requestData}/> */}
      </div>
    );
  };
export default AppSetting;

