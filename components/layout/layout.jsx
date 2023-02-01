import { Box, Heading,} from "@chakra-ui/react";
import React, { Fragment } from "react";
import Slidebar from "../sidebar/slidebar";


const Layout = (props) => {

  return (
    <Fragment>
      <Slidebar authorized={props.data?.authorized} allowedModules={props.data?.allowedModules}>
      {props.data?.authorized ? (
        <>
        {props.data.hasAccess?(<>
          <div>{props.children}</div>
        </>):(<>
        <Box>
          <Heading as="h5" size="sm" color="red">
            Not authorized to view this page. Please contact administrator.
          </Heading>
        </Box>
        </>)}
        </>
      ) : (<>
           <div>{props.children}</div> 
      </>)}
      </Slidebar>
    </Fragment>
    // <Fragment>
    //     <Slidebar>
    //       <div>{props.children}</div>
    //     </Slidebar>
    // </Fragment>    
  );
}
export default Layout;
