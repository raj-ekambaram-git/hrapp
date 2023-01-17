import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

  return (
    <div className={styles.main}>
        <div className={styles.iconsname}>
        {userService.isSuperAdmin() ? (     
          <>
            <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding={2}>
                Accounts
              </Box>
            </Link>
          </>       
        ): (
          <>
            
            <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Vendors
              </Box>
            </Link>
            
            <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Users
              </Box>
            </Link>
            <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Invoices
              </Box>
            </Link>
            <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Projects
              </Box>
            </Link>         
            <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                My Timesheets
              </Box>
            </Link>    
            <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                My Expenses
              </Box>
            </Link>              
          </>
        )}

          {(userService.isManager() || userService.isAccountAdmin()) ? (
            <>
            <Link href={`/account/user/timesheets/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Timesheet Approvals
              </Box>
            </Link>    
            <Link href={`/account/user/expenses/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <Box padding="8px">
                Expense Approvals
              </Box>
            </Link>              
            </>
          ) : (
            <>
            </>
          )}                   

        </div>
    </div>
  )
}

export default Slideclose