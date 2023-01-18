import { Box, Heading,} from "@chakra-ui/react";
import React, { Fragment } from "react";
import Slidebar from "../sidebar/slidebar";


const Layout = (props) => {

  return (
    <Fragment>
      <Slidebar>
      {props.data.authorized ? (
        <>
          <div>{props.children}</div>
        </>
      ) : (<>
        <Box>
          <Heading as="h4" color="red">
              Not authorized to view this page. Please contact administrator.
          </Heading>
        </Box>
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
