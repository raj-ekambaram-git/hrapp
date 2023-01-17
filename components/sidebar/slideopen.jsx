import React from 'react'
import styles from "./styles/slideopen.module.css"
import { FiUsers} from 'react-icons/fi';
import {VscCalendar, VscProject} from "react-icons/vsc"
import {BiGridAlt} from "react-icons/bi"
import {IoSettingsOutline} from "react-icons/io5"
import {MdOutlineManageAccounts,MdApproval} from 'react-icons/md';
import {FaFileInvoiceDollar, FaHandHoldingUsd} from 'react-icons/fa';
import {TbFileDollar} from 'react-icons/tb';


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

const tooltip_style= {
  maxWidth: "100px",
  bgColor: "black",
  color: "#F7FAFC"
}
const Slideopen = () => {
  return (
    <div className={styles.main}>
        <div className={styles.iconsbox}>
          {userService.isSuperAdmin() ? (
            <>
            <Tooltip label="Manage Accounts" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>
              <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <MdOutlineManageAccounts  className={styles.icons1}/>
                </div>
              </Link> 
            </Tooltip>    
            <Tooltip label="Users" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FiUsers  className={styles.icons1}/>
                  
                </div>
              </Link>
            </Tooltip>             
            <Tooltip label="App Settings" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>
              <Link href={`/app/setting/`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <IoSettingsOutline  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
            </>
          ) : (
            <>
            <Tooltip label="Vendors " placement='right' borderRadius="6px" padding="20px"  color='white' hasArrow bg="red" maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}> 
              <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <BiGridAlt  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>            
            <Tooltip label="Users" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FiUsers  className={styles.icons1}/>
                  
                </div>
              </Link>
            </Tooltip>
            <Tooltip label="Invoices" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>            
              <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FaFileInvoiceDollar  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>
            <Tooltip label="Projects" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow maxWidth={tooltip_style.maxWidth} backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <VscProject  className={styles.icons1}/>
                </div>
              </Link>     
            </Tooltip>       
            
              {userService.userValue ? (
                <>
                  <Tooltip label="Timesheets" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
                    <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                      <div>
                        <VscCalendar  className={styles.icons1}/>
                      </div>
                    </Link>   
                  </Tooltip>    
                  <Tooltip label="Expense" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
                    <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                      <div>
                        <TbFileDollar className={styles.icons1}/>
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
            <Tooltip label="Timesheet Approvals" placement='right' borderRadius="6px" padding="20px"  color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/timesheets/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <MdApproval  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>        
            <Tooltip label="Expense Approvals" placement='right' borderRadius="6px"  padding="20px" color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/expenses/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <FaHandHoldingUsd  className={styles.icons1}/>
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