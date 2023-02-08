import { Stack, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImportExport from "../../components/configuration/importExport";
import AccountDocuments from "../../components/configuration/user/accountDocuments";
import ManageWorkFlowTasks from "../../components/configuration/user/manageWorkFlowTasks";
import UserSetting from "../../components/configuration/user/userSetting";
import { ConfigConstants } from "../../constants";
import { userService } from "../../services";



const AccountSetting = (props) => {
  const router = useRouter();
  const [workFlowEnabled, setWorkFlowEnabled] = useState(false);

  const userId = userService?.userValue?.id;

  useEffect(() => {
    setWorkFlowEnabled(userService.accountFeatureEnabled(ConfigConstants.FEATURES.WORK_FLOW))
  }, []);


    return (      

      <Tabs variant='soft-rounded' colorScheme='teal' size="sm" isLazy>
        <TabList marginBottom={6}>
          <Tab border="1px" marginRight={4}>User</Tab>
          <Tab border="1px" marginRight={4}>Import/Export</Tab>
          <Tab border="1px" marginRight={4}>Documents</Tab>
          {workFlowEnabled?<><Tab border="1px" marginRight={4}>WorkFlow Management</Tab></>:<></>}          
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack width="page.sub_heading_width">
              <UserSetting />
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack width="page.sub_heading_width">
              <ImportExport/>            
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack width="page.sub_heading_width">
              <AccountDocuments/>            
            </Stack>
          </TabPanel>       
          {workFlowEnabled?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <ManageWorkFlowTasks/>            
              </Stack>
            </TabPanel>             
          </>:<></>}   
        </TabPanels>
      </Tabs>

    );
  };
export default AccountSetting;


