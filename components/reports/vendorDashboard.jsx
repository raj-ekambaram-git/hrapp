import React, { useEffect } from "react";
import { userService } from "../../services";




export default function VendorDashboard(props) {
  
  useEffect(() => {
    console.log("VendorDashboard.selectedReport::"+props.selectedReport)
    if(props.selectedReport) {
      console.log("Vendor Dashboard..")
    }

  }, []);

  return (
    <>Vendor Reports</>
  );
}
