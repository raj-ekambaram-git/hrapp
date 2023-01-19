import React, { useEffect, useState } from 'react'
import styles from "./styles/slideopen.module.css"
import { FiUsers} from 'react-icons/fi';
import {VscCalendar, VscProject} from "react-icons/vsc"
import {BiGridAlt} from "react-icons/bi"
import {IoSettingsOutline} from "react-icons/io5"
import {MdOutlineManageAccounts,MdApproval} from 'react-icons/md';
import {FaFileInvoiceDollar, FaHandHoldingUsd} from 'react-icons/fa';
import {TbFileDollar} from 'react-icons/tb';
import cookie from 'js-cookie'
import { Tooltip } from '@chakra-ui/react'
import Link from "next/link";
import { access } from '../../helpers/access';

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
const Slideopen = () => {
  const [allowedModule, setAllowedModule] = useState([]);
  
  useEffect(() => {
    getModules();
  }, []);

  async function getModules(){
    const userCookie = cookie.get("user");
    if(userCookie){
      setAllowedModule(await access.getAllowedModules(JSON.parse(userCookie).authToken))
    }
    console.log("ALLOWED MODULE::"+allowedModule)
  }

  return (
    <div className={styles.main}>
        <div className={styles.iconsbox}>
          {allowedModule.includes("account")?(<>
            <Tooltip label="Manage Accounts" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <MdOutlineManageAccounts  className={styles.icons1}/>
                </div>
              </Link> 
            </Tooltip>    
          </>):""}
          {allowedModule.includes("user")?(<>
            <Tooltip label="Users" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FiUsers  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>             
          </>):""}          
          {allowedModule.includes("vendor")?(<>
            <Tooltip label="Vendors " placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color}  hasArrow backgroundColor={tooltip_style.bgColor}> 
              <Link href={`/account/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <BiGridAlt  className={styles.icons1}/>
                </div>
              </Link>
            </Tooltip>            
          </>):""}          
          {allowedModule.includes("project")?(<>
            <Tooltip label="Projects" placement='right' borderRadius="6px" padding="10px" fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/projects`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <VscProject  className={styles.icons1}/>
                </div>
              </Link>     
            </Tooltip>       
          </>):""}          
          {allowedModule.includes("invoice")?(<>
            <Tooltip label="Invoices" placement='right' borderRadius="6px" padding="10px" fontWeight={600}  color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>            
              <Link href={`/account/invoices`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                <div>
                  <FaFileInvoiceDollar  className={styles.icons1}/>
                </div>
              </Link>   
            </Tooltip>          
          </>):""}          
          {allowedModule.includes("timesheet")?(<>
              <Tooltip label="Timesheets" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
                <Link href={`/account/user/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <VscCalendar  className={styles.icons1}/>
                  </div>
                </Link>   
              </Tooltip>    
          </>):""}          
          {allowedModule.includes("expense")?(<>
              <Tooltip label="Expense" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
                <Link href={`/account/user/expenses`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <TbFileDollar className={styles.icons1}/>
                  </div>
                </Link>   
              </Tooltip>    
          </>):""}          
          {allowedModule.includes("timesheet_approval")?(<>
            <Tooltip label="Timesheet Approvals" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/timesheets/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <MdApproval  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>        
          </>):""}          
          {allowedModule.includes("expense_approval")?(<>
            <Tooltip label="Expense Approvals" placement='right' borderRadius="6px"  padding="10px" fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/account/user/expenses/approval`} styles={({isManagerActive}) => (isManagerActive ? navbaractive: navbarnotactive)}>  
                  <div>
                    <FaHandHoldingUsd  className={styles.icons1}/>
                  </div>
              </Link>   
            </Tooltip>                
          </>):""}          
          {allowedModule.includes("setting")?(<>
            <Tooltip label="App Settings" placement='right' borderRadius="6px" padding="10px"  fontWeight={600} color={tooltip_style.color} hasArrow  backgroundColor={tooltip_style.bgColor}>
              <Link href={`/app/setting/`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
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