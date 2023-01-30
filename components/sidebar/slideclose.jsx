import React from 'react'
import Link from "next/link";
import styles from "./styles/slideclose.module.css"

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

const Slideclose = (props) => {


  return (
    <div className={styles.main}>
        <div className={styles.iconsname}>
        {props.allowedModule?.includes("account")?(<>
          <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Accounts
            </Box>
          </Link>
        </>):""}
        {props.allowedModule?.includes("user")?(<>
          <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Users
            </Box>
          </Link>
        </>):""}
        {props.allowedModule?.includes("vendor")?(<>
          <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Vendors
            </Box>
          </Link>
        </>):""}
        {props.allowedModule?.includes("project")?(<>
          <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Projects
            </Box>
          </Link>         
        </>):""}
        {props.allowedModule?.includes("invoice")?(<>
          <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Invoices
            </Box>
          </Link>
        </>):""}
        {props.allowedModule?.includes("timesheet")?(<>
          <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Timesheets
            </Box>
          </Link>    
        </>):""}
        {props.allowedModule?.includes("expense")?(<>
          <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
               Expenses
            </Box>
          </Link>              
        </>):""}
        {props.allowedModule?.includes("timesheet_approval")?(<>
          <Link href={`/account/user/timesheets/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Timesheet Approvals
            </Box>
          </Link>    
        </>):""}
        {props.allowedModule?.includes("expense_approval")?(<>
          <Link href={`/account/user/expenses/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Expense Approvals
            </Box>
          </Link>           
        </>):""}
        {props.allowedModule?.includes("expense_payments")?(<>
          <Link href={`/account/user/expenses/payment`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Expense Payment
            </Box>
          </Link>           
        </>):""}        
        {props.allowedModule?.includes("cost")?(<>
          <Link href={`/account/user/cost`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Manage Cost
            </Box>
          </Link>           
        </>):""}            
        {props.allowedModule?.includes("reports")?(<>
          <Link href={`/reports/dashboard`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <Box padding="8px">
              Reports
            </Box>
          </Link>           
        </>):""}             
        {props.allowedModule?.includes("app_setting")?(<>
          <Link href={`/app/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                App Setting
              </Box>
            </Link>           
        </>):""}
        {props.allowedModule?.includes("app_admin_setting")?(<>
          <Link href={`/app/admin/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                App Admin Settings
              </Box>
            </Link>           
        </>):""}
        {props.allowedModule?.includes("account_setting")?(<>
          <Link href={`/account/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Account Setting
              </Box>
            </Link>           
        </>):""}
        {props.allowedModule?.includes("user_setting")?(<>
          <Link href={`/account/user/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                User Setting
              </Box>
            </Link>           
        </>):""}                        
        </div>
    </div>
  )
}

export default Slideclose