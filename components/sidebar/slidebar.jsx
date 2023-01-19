import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/router';
import styles from "./styles/slidebar.module.css"
import {VscMenu} from "react-icons/vsc"
import Link from "next/link";
import Slideclose from './slideclose';
import Slideopen from "./slideopen"
import {FaUserCheck} from "react-icons/fa"
import { useDispatch } from 'react-redux';
import {
  Container, Flex, HStack, Text, Box, Stack
} from '@chakra-ui/react'
import { userService } from '../../services';
import {GrLogout, GrLogin} from 'react-icons/gr';
import { Tooltip, WrapItem, Spacer } from '@chakra-ui/react'
import { removeLoggedInUser } from '../../store/modules/User/actions';
import { roleAccess } from '../../helpers/roleAccess';
import cookie from 'js-cookie'

const Slidebar = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [allowedModule, setAllowedModule] = useState([]);
  const [state,setstate]=useState(false);
  const handleclick=()=>{
      setstate(!state)
  }

 function handleLogout(){
  userService.logout()
  dispatch(removeLoggedInUser())
  router.push('/login');
 }
 
  
 useEffect(() => {
   getModules();
 }, []);

 async function getModules(){
   const userCookie = cookie.get("user");
   if(userCookie){
     setAllowedModule(await roleAccess.getAllowedModules(JSON.parse(userCookie).authToken))
   }
   console.log("ALLOWED MODULE::"+allowedModule)
 }
 
  return (
    <div className={styles.main}>

          <div className={styles.navbar}>

            <div className={styles.navbarleftmain} bgColor="red">
            
              <div  onClick={handleclick} className={styles.menuicons} >
                <VscMenu fontSize="27px" />
              </div>
              <div>
                LOGO IMAGE
              </div>
            </div>
            {/* right div */}
              <div className={styles.navbarrightmain}>
                  <Spacer/>
                  <HStack>
                    {userService.userValue ? (<>
                      <Box marginRight={4} textAlign="center">Hi, {userService.userValue?.firstName} {userService?.userValue?.lastName}!</Box>
                    </>) : (<></>)}
                  <Flex marginRight={4}>
                    <Link href={`/account/user/detail`} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                      <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
                        <FaUserCheck fontSize="27px"/>
                      </div>
                    </Link>
                  </Flex>
                  <Flex>
                    <WrapItem>
                            {userService.userValue ? (<>
                              <Tooltip label='Logout' hasArrow arrowSize={15} placement='bottom' color="teal">
                                <Link href="" onClick={() => handleLogout()} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                                  <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
                                    <GrLogout  fontSize="27px"/>
                                  </div>
                                </Link>
                              </Tooltip>
                            </>) : (<>
                              <Tooltip label='Login' hasArrow arrowSize={15} placement='bottom' color="teal">
                                <Link href="" onClick={() => handleLogout()} styles={({isActive}) => (isActive ? navbaractive: navbarnotactive)}>  
                                  <div style={{weidth:"40px",marginRight:"20px",marginTop:"6px"}}>
                                    <GrLogin  fontSize="27px"/>
                                  </div>
                                </Link>
                              </Tooltip>
                            </>)}
                    </WrapItem> 
                    </Flex>    
                  </HStack>            
                  
              </div>
            
            </div>
            {userService.userValue ? (
                <div className={styles.Slideflex}>
                    <div>{
                            state ? <div className={styles.slidingfuncbox}>
                          <div><Slideopen allowedModule={allowedModule}/></div>
                          <div><Slideclose allowedModule={allowedModule}/></div>
                    </div>:
                          <div>
                              <Slideopen allowedModule={allowedModule}/>
                          </div>

                          }
                        
                    </div>
                    <div className={styles.mainContainer}>
                        <Container marginLeft={2}>
                          {props.children}
                        </Container>
                    </div>
                  </div>  
            ) : (<>
              <div className={styles.mainContainer}>
                  <Container marginLeft={2}>
                    {props.children}
                  </Container>
              </div>            
            </>)}      
    </div>
  )
}

export default Slidebar