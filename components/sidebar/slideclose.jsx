import React, { useEffect, useState } from 'react'
// import { roleAccess } from '../../helpers/roleAccess';
import cookie from 'js-cookie'
import Link from "next/link";
import styles from "./styles/slideclose.module.css"
import { userService } from '../../services';
import {
  Box,
} from '@chakra-ui/react';
const navbaractive={
  backgroundColor: "",
  // color:"white",
   color:"rgb(35,192,254)"
}
const navbarnotactive={
  backgroundColor:"teal",
  color:"white"
}

const Slideclose = () => {

  const [allowedModule, setAllowedModule] = useState([]);
  
  useEffect(() => {
    // getModules();
  }, []);

  async function getModules(){
    const userCookie = cookie.get("user");
    if(userCookie){
      setAllowedModule(await roleAccess.getAllowedModules(JSON.parse(userCookie).authToken))
    }
    console.log("ALLOWED MODULE::"+allowedModule)
  }

  return (
    <div className={styles.main}>
        <div className={styles.iconsname}>
        {allowedModule.includes("account")?(<>
          <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding={2}>
              Accounts
            </Box>
          </Link>
        </>):""}
        {allowedModule.includes("user")?(<>
          <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Users
            </Box>
          </Link>
        </>):""}
        {allowedModule.includes("vendor")?(<>
          <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Vendors
            </Box>
          </Link>
        </>):""}
        {allowedModule.includes("project")?(<>
          <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Projects
            </Box>
          </Link>         
        </>):""}
        {allowedModule.includes("invoice")?(<>
          <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Invoices
            </Box>
          </Link>
        </>):""}
        {allowedModule.includes("timesheet")?(<>
          <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Timesheets
            </Box>
          </Link>    
        </>):""}
        {allowedModule.includes("expense")?(<>
          <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
               Expenses
            </Box>
          </Link>              
        </>):""}
        {allowedModule.includes("timesheet_approval")?(<>
          <Link href={`/account/user/timesheets/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Timesheet Approvals
            </Box>
          </Link>    
        </>):""}
        {allowedModule.includes("expense_approval")?(<>
          <Link href={`/account/user/expenses/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Expense Approvals
            </Box>
          </Link>           
        </>):""}
        {allowedModule.includes("setting")?(<>
          <Link href={`/account/user/expenses/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Settings
              </Box>
            </Link>           
        </>):""}
        </div>
    </div>
  )
}

export default Slideclose