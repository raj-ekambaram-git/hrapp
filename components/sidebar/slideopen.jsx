import React, { useEffect, useState } from 'react'
import styles from "./styles/slideopen.module.css"
import { FiUsers} from 'react-icons/fi';
import {VscCalendar, VscProject} from "react-icons/vsc"
import {BiGridAlt} from "react-icons/bi"
import {MdPayments} from "react-icons/md"
import {IoSettingsOutline} from "react-icons/io5"
import {MdOutlineManageAccounts,MdApproval} from 'react-icons/md';
import {FaFileInvoiceDollar, FaHandHoldingUsd} from 'react-icons/fa';
import {TbFileDollar, TbReportAnalytics} from 'react-icons/tb'
import { Tooltip } from '@chakra-ui/react'
import Link from "next/link";
import { GrConfigure } from 'react-icons/gr';



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
  bgColor: "#4FD1C5",
  color: "black"
}
const Slideopen = (props) => {


  return (
    <div className={styles.main}>
        <div className={styles.iconsbox}>
          {props.allowedModule?.includes("account")?(<>
            <Tooltip label="Manage Accounts" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <MdOutlineManageAccounts  className={styles.icons1}/>
                </div>
              </Link> 
            </Tooltip>    
          </>):""}
          {props.allowedModule?.includes("user")?(<>
            <Tooltip label="Users" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FiUsers  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>             
          </>):""}          
          {props.allowedModule?.includes("vendor")?(<>
            <Tooltip label="Vendors " placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color}  hasArrow backgroundColor={tooltip_style.bgColor}> 
              <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <BiGridAlt  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>            
          </>):""}          
          {props.allowedModule?.includes("project")?(<>
            <Tooltip label="Projects" placement='right' borderRadius="6px" padding="10px" fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <VscProject  className={styles.icons1}/>
                </div>
              </Link>     
            </Tooltip>       
          </>):""}          
          {props.allowedModule?.includes("invoice")?(<>
            <Tooltip label="Invoices" placement='right' borderRadius="6px" padding="10px" fontWeight={600}  color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>            
              <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FaFileInvoiceDollar  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>          
          </>):""}          
          {props.allowedModule?.includes("timesheet")?(<>
              <Tooltip label="Timesheets" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
                <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <VscCalendar  className={styles.icons1}/>
                  </div>
                </Link>   
              </Tooltip>    
          </>):""}          
          {props.allowedModule?.includes("expense")?(<>
              <Tooltip label="Expense" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
                <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <TbFileDollar className={styles.icons1}/>
                  </div>
                </Link>   
              </Tooltip>    
          </>):""}          
          {props.allowedModule?.includes("timesheet_approval")?(<>
            <Tooltip label="Timesheet Approvals" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/timesheets/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <MdApproval  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>        
          </>):""}          
          {props.allowedModule?.includes("expense_approval")?(<>
            <Tooltip label="Expense Approvals" placement='right' borderRadius="6px"  padding="10px" fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/expenses/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <FaHandHoldingUsd  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>                
          </>):""}     
          {props.allowedModule?.includes("expense_payments")?(<>
            <Tooltip label="Expense Payment" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/expenses/payment`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <MdPayments  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}        
          {props.allowedModule?.includes("reports")?(<>
            <Tooltip label="Reports" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/reports/dashboard`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <TbReportAnalytics  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}                         
          {props.allowedModule?.includes("app_setting")?(<>
            <Tooltip label="App Setting" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/app/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <IoSettingsOutline  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}          
          {props.allowedModule?.includes("app_admin_setting")?(<>
            <Tooltip label="App Admin Setting" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/app/admin/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <GrConfigure  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}        
          {props.allowedModule?.includes("account_setting")?(<>
            <Tooltip label="Account Setting" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <IoSettingsOutline  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}          
          {props.allowedModule?.includes("user_setting")?(<>
            <Tooltip label="User Setting" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/setting`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <IoSettingsOutline  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>                                              
          </>):""}          
        </div>
    </div>
  )
}

export default Slideopen