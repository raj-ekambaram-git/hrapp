import { Box,} from "@chakra-ui/react";
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
