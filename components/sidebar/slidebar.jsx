import React, { useState,useEffect } from 'react'
// import Slideclose from './Slideclose';
// import Slideopen from './Slideopen';
import styles from "./styles/slidebar.module.css"
import {VscMenu} from "react-icons/vsc"
import Link from "next/link";
import Slideclose from './slideclose';
import Slideopen from "./slideopen"

// import Projects from '../../Features/Pages/Reporting/Projects';

import {BsQuestionCircle} from "react-icons/bs"
import {IoNotificationsSharp} from "react-icons/io5"
import {FaUserCheck} from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux';
import {
  Container
} from '@chakra-ui/react'
import { userService } from '../../services';
import {GrLogout} from 'react-icons/gr';
import { Tooltip, WrapItem } from '@chakra-ui/react'
import { PageNotAuthorized } from "../../components/common/pageNotAuthorized";
const Slidebar = (props) => {
 const [state,setstate]=useState(false);
 const handleclick=()=>{
    setstate(!state)
 }


 const dispatch=useDispatch();

   
 

  return (
    <div className={styles.main}>

      {userService.isAuthenticated() ? (
        <>
          <div className={styles.navbar}>

            <div className={styles.navbarleftmain}>
            
              <div  onClick={handleclick} className={styles.menuicons} >
                <VscMenu fontSize="27px" />
              
              </div>
              <div>
                LOGO IMAGE
              </div>
            </div>
            {/* right div */}
            <div className={styles.navbarrightmain}>
                <div>
                  <p style={{marginTop:"5px"}}> Hi, {userService.userValue.firstName} {userService.userValue.lastName}!</p>
                </div>
                <Link href={`/account/user/${userService.userValue.id}/detail`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                  <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
                    <FaUserCheck fontSize="27px"/>
                  </div>
                </Link>
                <WrapItem>
                  <Tooltip label='Logout' hasArrow arrowSize={15} placement='bottom' color="teal">
                    <Link href="" onClick={() => userService.logout()} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                      <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
                        <GrLogout  fontSize="27px"/>
                        
                      </div>
                    </Link>
                  </Tooltip>
                </WrapItem>                
                
            </div>
            
            </div>

            <div className={styles.Slideflex}>
            <div>{
                    state ? <div className={styles.slidingfuncbox}>
                  <div><Slideopen/></div>
                  <div><Slideclose/></div>
            </div>:
                  <div>
                      <Slideopen/>
                  </div>

                  }
                
            </div>
            <div className={styles.mainContainer}>
            
                <Container marginLeft={2}>
                  {props.children}
                </Container>
              
            </div>
          </div>        
        </>
      ) : (
        <>
          <div> Page Not Authorized!</div>
        </>
      )}
    

    </div>
  )
}

export default Slidebar