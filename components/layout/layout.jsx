import React, { Fragment } from "react";
import Slidebar from "../sidebar/slidebar";


const Layout = (props) => {

  return (
    <Fragment>
      {props.data.authorized ? (
        <>
        <Slidebar>
          <div>{props.children}</div>
        </Slidebar>
        </>
      ) : (<>
         <div>{props.children}</div>
      </>)}
    </Fragment>
  );
}
export default Layout;
