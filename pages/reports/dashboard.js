import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useState } from "react";
import AccountDashboard from "../../components/reports/accountDashboard";
import ProjectDashboard from "../../components/reports/projectDashboard";
import VendorDashboard from "../../components/reports/vendorDashboard";
import { userService } from "../../services";






export default function Dashboard(props) {
  const [accountReport, setAccountReport] = useState(true);
  const [vendorReport, setVendorReport] = useState(false);
  const [projectReport, setProjectReport] = useState(false);

  function handleReportSelection(moduleSelected) {

    switch(moduleSelected) {
      case "account": 
        setAccountReport(true)
        break;
      case "vendor": 
        setVendorReport(true)
        break;
      case "project": 
        setProjectReport(true)
        break;
      default:
        console.log("account");                    
        break;

    }

  }

  const userId = userService?.userValue?.id;

  const data = {
    action: "userReportDashboard",
    userId: userId
  }
  return (
    <Tabs isFitted variant='reports' size="sm">
      <TabList mb='1em'>
        <Tab onClick={() => handleReportSelection("account")}>Account</Tab>
        <Tab onClick={() => handleReportSelection("vendor")}>Vendor</Tab>
        <Tab onClick={() => handleReportSelection("project")}>Project</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {accountReport?<AccountDashboard/>:<></>}
        </TabPanel>
        <TabPanel>
          {vendorReport?<VendorDashboard/>:<></>}
        </TabPanel>
        <TabPanel>
          {projectReport?<ProjectDashboard/>:<></>}          
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
