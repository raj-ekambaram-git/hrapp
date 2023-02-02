import { Stack, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
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

      <Tabs variant='soft-rounded' colorScheme='teal' size="sm" >
        <TabList marginBottom={6}>
          <Tab border="1px" marginRight={4}>User</Tab>
          <Tab border="1px" marginRight={4}>Import/Export</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
              Still Building it...
          </TabPanel>
          <TabPanel>
            <Stack width="page.sub_heading_width">
              <ImportExport/>            
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

    );
  };
export default AccountSetting;


