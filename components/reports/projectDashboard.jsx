import React, { useEffect } from "react";
import { userService } from "../../services";



export default function ProjectDashboard(props) {

  useEffect(() => {
    console.log("ProjectDashboard.selectedReport::"+props.selectedReport)
    if(props.selectedReport) {
      console.log("Project Dashboard..")
    }
  }, []);
  
  return (
    <>Project</>
  );
}
