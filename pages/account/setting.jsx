import { Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImportExport from "../../components/configuration/importExport";
import SettingHeader from "../../components/configuration/settingHeader";
import { userService } from "../../services";


const AccountSetting = (props) => {
  const router = useRouter();

  const userId = userService?.userValue?.id;

  useEffect(() => {

  }, []);


    return (      
      <Stack width="page.sub_heading_width">
        <SettingHeader heading="Account Settings for" param1="Account Name"/>
        <ImportExport/>
      
      </Stack>
    );
  };
export default AccountSetting;


