import React, { Fragment } from "react";
import Sidebar from "../sidebar/sidebar";


const Layout = (props) => {
  return (
    <Fragment>
      <Sidebar/>
      <div>{props.children}</div>
    </Fragment>
  );
}
export default Layout;
