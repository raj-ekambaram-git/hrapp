import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from "next/link";
import styles from "./styles/slideclose.module.css"
import { userService } from '../../services';
import {
  Text,
} from '@chakra-ui/react';
const navbaractive={
  backgroundColor: "",
  // color:"white",
   color:"rgb(35,192,254)"
}
const navbarnotactive={
  backgroundColor:"silver",
  color:"white"
}

const Slideclose = () => {
  // const {user}=useSelector(state=>state.auth)
  // const dispatch=useDispatch()
  // useEffect(()=>{
  //   if
  // dispatch(getGoals())
  // },[user])
  return (
    <div className={styles.main}>
        <div className={styles.iconsname}>
        {userService.isSuperAdmin() ? (     
          <>
            <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>Accounts</p>
              </div>
            </Link>
          </>       
        ): (
          <>
            
            <Link href={`/account/${userService.getAccountDetails().accountId}/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
                <p>Vendors</p>
              </div>
            </Link>
            
            <Link href={`/account/${userService.getAccountDetails().accountId}/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>Users</p>
              </div>
            </Link>
            <Link href={`/account/${userService.getAccountDetails().accountId}/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>Invoices</p>
              </div>
            </Link>
            <Link href={`/account/${userService.getAccountDetails().accountId}/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>Projects</p>
              </div>
            </Link>         
            <Link href={`/account/user/${userService.userValue.id}/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>My Timesheet</p>
              </div>
            </Link>    
          </>
        )}

          {(userService.isManager() || userService.isAccountAdmin()) ? (
            <>
            <Link href={`/account/user/${userService.userValue.id}/timesheets/approval`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
              <div>
              <p>Timesheets to Approve</p>
              </div>
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