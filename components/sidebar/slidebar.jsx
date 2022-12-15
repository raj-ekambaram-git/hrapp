import React, { useState,useEffect } from 'react'
// import Slideclose from './Slideclose';
// import Slideopen from './Slideopen';
import styles from "./styles/slidebar.module.css"
import {VscMenu} from "react-icons/vsc"
import { Route, Routes} from 'react-router-dom';
import Calender from '../../pages/time/calender';
import Clientdiv from '../../pages/time/client';
import Dashboard from '../../pages/time/dashboard';

import Slideclose from './slideclose';
import Slideopen from "./slideopen"

// import Projects from '../../Features/Pages/Reporting/Projects';

import {BsQuestionCircle} from "react-icons/bs"
import {IoNotificationsSharp} from "react-icons/io5"
import {FaUserCheck} from "react-icons/fa"
import Spinner from "../../components/spinner/spinner"
import { useDispatch, useSelector } from 'react-redux';
import {
  Container
} from '@chakra-ui/react'

const Slidebar = (props) => {
 const [state,setstate]=useState(false);
 const handleclick=()=>{
    setstate(!state)
 }

 const dispatch=useDispatch();

   
 

  return (
    <div className={styles.main}>

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
              <p style={{marginTop:"5px"}}> ABHISHEK WORKSPACE</p>
            </div>
            <div className={styles.upgradebtn}>
            <button >UPGRADE</button>
            </div>
            <div style={{weight:"20px",marginTop:"6px"}}>
              <BsQuestionCircle fontSize="27px"/>
            </div>
            <div style={{marginTop:"6px"}}>
            <IoNotificationsSharp fontSize="27px"/>
            </div>
            <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
              <FaUserCheck fontSize="27px"/>
            </div>
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

    </div>
  )
}

export default Slidebar