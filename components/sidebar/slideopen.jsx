import React from 'react'
import styles from "./styles/slideopen.module.css"
import { FiUsers} from 'react-icons/fi';
import {VscCalendar} from "react-icons/vsc"
import {BiGridAlt} from "react-icons/bi"
import {IoStatsChart,IoSettingsOutline} from "react-icons/io5"
import {BsTagFill} from "react-icons/bs"
import {FaFileAlt,FaUsers,FaRegUserCircle} from "react-icons/fa"
import {GiThreeFriends} from 'react-icons/gi';
import {MdOutlineManageAccounts,MdOutlineApproval} from 'react-icons/md';
import {FaFileInvoiceDollar} from 'react-icons/fa';
import {GrProjects} from 'react-icons/gr';

import { userService } from '../../services';
import { Tooltip } from '@chakra-ui/react'


import Link from "next/link";
const navbaractive={
  backgroundColor: "black",
   color:"rgb(35,192,254)"
}
const navbarnotactive={
  backgroundColor:"silver",
  color:"black"
}
const Slideopen = () => {
  return (
    <div className={styles.main}>
        <div className={styles.iconsbox}>
          {userService.isSuperAdmin() ? (
            <>
              <Tooltip label="Manage Accounts" placement='right' color='teal' hasArrow>
              <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <MdOutlineManageAccounts  className={styles.icons1}/>
                </div>
              </Link> 
            </Tooltip>     
            <Tooltip label="App Settings" placement='right' color='teal' hasArrow>
              <Link href={`/app/setting/`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <IoSettingsOutline  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
            </>
          ) : (
            <>
            <Tooltip label="Vendors" placement='right' color='teal' hasArrow>
              <Link href={`/account/${userService.getAccountDetails().accountId}/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <BiGridAlt  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>            
            <Tooltip label="Users" placement='right' color='teal' hasArrow>
              <Link href={`/account/${userService.getAccountDetails().accountId}/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FiUsers  className={styles.icons1}/>
                  
                </div>
              </Link>
            </Tooltip>
            <Tooltip label="Invoices" placement='right' color='teal' hasArrow>            
              <Link href={`/account/${userService.getAccountDetails().accountId}/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FaFileInvoiceDollar  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>
            <Tooltip label="Projects" placement='right' color='teal' hasArrow>
              <Link href={`/account/${userService.getAccountDetails().accountId}/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <GrProjects  className={styles.icons1}/>
                </div>
              </Link>     
            </Tooltip>       
            
              {userService.userValue ? (
                <>
                  <Tooltip label="Timesheets" placement='right' color='teal' hasArrow>
                    <Link href={`/account/user/${userService.userValue.id}/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                      <div>
                        <VscCalendar  className={styles.icons1}/>
                      </div>
                    </Link>   
                  </Tooltip>    
                </>
              ) : (
                <>
                </>
              )}
                          
            </>
          )}

          {(userService.isManager() || userService.isAccountAdmin()) ? (
            <>
            <Tooltip label="Timesheet Approvals" placement='right' color='teal' hasArrow>
              <Link href={`/account/user/${userService.userValue.id}/timesheets/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <MdOutlineApproval  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>         
            </>
          ) : (
            <>
            </>
          )}

        </div>
    </div>
  )
}

export default Slideopen