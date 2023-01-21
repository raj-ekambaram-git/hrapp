import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ConfigAdminList from "../../components/configuration/configAdminList";
import { userService } from "../../services";


const AppSetting = (props) => {
  const router = useRouter();

  const userId = userService?.userValue?.id;

  useEffect(() => {

  }, []);


    return (
      <div className="main__container">
        <ConfigAdminList/>
      </div>

    );
  };
export default AppSetting;


