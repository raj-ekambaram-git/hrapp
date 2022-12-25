import React from 'react'
import styles from "./styles/slideopen.module.css"
import { FiClock} from 'react-icons/fi';
import {VscCalendar} from "react-icons/vsc"
import {BiGridAlt} from "react-icons/bi"
import {IoStatsChart,IoSettingsOutline} from "react-icons/io5"
import {BsTagFill} from "react-icons/bs"
import {FaFileAlt,FaUsers,FaRegUserCircle} from "react-icons/fa"
import {GiThreeFriends} from 'react-icons/gi';
import { userService } from '../../services';

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
          <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
              <VscCalendar  className={styles.icons1}/>
            </div>
          </Link>
          <Link href={`/account/${userService.getAccountDetails().accountId}/vendors`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
              <BiGridAlt  className={styles.icons1}/>
            </div>
          </Link>
          <Link href={`/account/${userService.getAccountDetails().accountId}/users`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
              <IoSettingsOutline  className={styles.icons1}/>
            </div>
          </Link>
          <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
              <IoSettingsOutline  className={styles.icons1}/>
            </div>
          </Link>          
          <Link href={`/account/user/${userService.userValue.id}/timesheets`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
              <IoSettingsOutline  className={styles.icons1}/>
            </div>
          </Link>
        </div>
        </div>
  )
}

export default Slideopen