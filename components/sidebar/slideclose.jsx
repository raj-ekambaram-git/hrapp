import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from "next/link";
import styles from "./styles/slideclose.module.css"
import { userService } from '../../services';
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
            
          <Link href={`/account/${userService.getAccountDetails().accountId}/list`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
            <p>Accounts</p>
            </div>
          </Link>
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
          <Link href={`/accounts`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
            <div>
            <p>Accounts</p>
            </div>
          </Link>

        </div>
    </div>
  )
}

export default Slideclose