import { Stack, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImportExport from "../../components/configuration/importExport";
import AccountDocuments from "../../components/configuration/user/accountDocuments";
import ManagePaymentAccounts from "../../components/configuration/user/managePaymentAccounts";
import ManageScheduleJob from "../../components/configuration/user/manageScheduleJob";
import ManageWorkFlowTasks from "../../components/configuration/user/manageWorkFlowTasks";
import UserSetting from "../../components/configuration/user/userSetting";
import { ConfigConstants } from "../../constants";
import { userService } from "../../services";



const AccountSetting = (props) => {
  const router = useRouter();
  const [workFlowEnabled, setWorkFlowEnabled] = useState(false);
  const [scheduleJob, setScheduleJob] = useState(false);
  const [payment, setPayment] = useState(false);
  const [importExport, setImportExport] = useState(false);
  const [documents, setDocuments] = useState(false);

  const userId = userService?.userValue?.id;

  useEffect(() => {
    setWorkFlowEnabled(userService.accountFeatureEnabled(ConfigConstants.FEATURES.WORK_FLOW) && userService.isWorkFlowAdmin())
    setScheduleJob(userService.accountFeatureEnabled(ConfigConstants.FEATURES.SCHEDULE_JOB) && userService.isScheduleJobAdmin())
    setPayment(userService.accountFeatureEnabled(ConfigConstants.FEATURES.PAYMENT) && userService.isPaymentAdmin())
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      setImportExport(true)
      setDocuments(true)
    }
  }, []);


    return (      

      <Tabs isFitted variant='accountSetting'  colorScheme='teal' size="xs" isLazy>
        <TabList marginBottom={6}>
          <Tab border="1px" marginRight={4}>User</Tab>
          {importExport?<><Tab border="1px" marginRight={4}>Import/Export</Tab></>:<></>}
          {documents?<><Tab border="1px" marginRight={4}>Documents</Tab></>:<></>}
          {payment?<><Tab border="1px" marginRight={4}>Payments</Tab></>:<></>}        
          {workFlowEnabled?<><Tab border="1px" marginRight={4}>WorkFlow</Tab></>:<></>}          
          {scheduleJob?<><Tab border="1px" marginRight={4}>Schedule Jobs</Tab></>:<></>}          
            
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack width="page.sub_heading_width">
              <UserSetting />
            </Stack>
          </TabPanel>
          {importExport?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <ImportExport/>            
              </Stack>
            </TabPanel>
          </>:<></>}
          {documents?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <AccountDocuments/>            
              </Stack>
            </TabPanel>       
          </>:<></>}
          {payment?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <ManagePaymentAccounts/>            
              </Stack>
            </TabPanel>             
          </>:<></>}                
          {workFlowEnabled?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <ManageWorkFlowTasks/>            
              </Stack>
            </TabPanel>             
          </>:<></>}   
          {scheduleJob?<>
            <TabPanel>
              <Stack width="page.sub_heading_width">
                <ManageScheduleJob/>            
              </Stack>
            </TabPanel>             
          </>:<></>}          
        </TabPanels>
      </Tabs>

    );
  };
export default AccountSetting;


