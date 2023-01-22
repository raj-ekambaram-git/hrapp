import React, { useEffect } from "react";
import { userService } from "../../services";




export default function VendorDashboard(props) {
  
  useEffect(() => {
    console.log("VendorDashboard.selectedReport::")
  }, []);

  return (
    <>Vendor Reports</>
  );
}
