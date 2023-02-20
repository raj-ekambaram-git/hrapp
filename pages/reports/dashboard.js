import { Box, Button, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountDashboard from "../../components/reports/accountDashboard";
import ProjectDashboard from "../../components/reports/projectDashboard";
import VendorDashboard from "../../components/reports/vendorDashboard";
import { reportsService, userService } from "../../services";


export default function Dashboard(props) {
  const [accountReport, setAccountReport] = useState(true);
  const [vendorReport, setVendorReport] = useState(false);
  const [projectReport, setProjectReport] = useState(false);
  const selectedTabIndex = useSelector(state => state.reports.selectedReportsTabIndex);

  useEffect(() => {
    if(selectedTabIndex === 2) {
      handleReportSelection("project")    
    }else if(selectedTabIndex === 1) {
      handleReportSelection("vendor")    
    }else {
      handleReportSelection("account")    
    }
    
  },[selectedTabIndex])

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

  const handleExportPDF = async () => {
    
    const reportsBuffer = await reportsService.generatePDFReport("/reports/dashboard", userService.getAccountDetails().accountId)
    if(!reportsBuffer.error) {
      const blob = new Blob([reportsBuffer]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'invoice_.pdf';
      link.click();
  
    }
  }
  const userId = userService?.userValue?.id;

  const data = {
    action: "userReportDashboard",
    userId: userId
  }
  return (
    <Box width="1600px">
      <Tabs isFitted variant='reports' size="sm" defaultIndex={selectedTabIndex}>
        <TabList mb='1em'>
          <Tab onClick={() => handleReportSelection("account")}>Account</Tab>
          <Tab onClick={() => handleReportSelection("vendor")}>Client</Tab>
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
    </Box>
  );
}
