import React, { Fragment } from "react";
import Slidebar from "../sidebar/slidebar";


const Layout = (props) => {
  return (
    <Fragment>
      <Slidebar>
         <div>{props.children}</div>
      </Slidebar>
    </Fragment>
  );
}
export default Layout;
