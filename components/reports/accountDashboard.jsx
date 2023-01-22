import React, { useEffect } from "react";
import { userService } from "../../services";




export default function AccountDashboard(props) {

  useEffect(() => {
    console.log("AccountDashboard.selectedReport::"+props.selectedReport)
    if(props.selectedReport) {
      console.log("Account Dashboard..")
    }

  }, []);


  return (
    <>Account Reports</>
  );
}
