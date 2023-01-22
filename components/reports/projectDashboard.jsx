import React, { useEffect } from "react";
import { projectService, userService } from "../../services";



export default function ProjectDashboard(props) {

  const projectId = parseInt("2");

  useEffect(() => {
    console.log("ProjectDashboard.selectedReport::")
    getProjectBudgetDetails();
  }, []);
  
  async function getProjectBudgetDetails() {
    const responseData = await projectService.getProjectBudgetDetails(projectId, userService.getAccountDetails().accountId);

    console.log("responseData:::"+JSON.stringify(responseData))
  }

  return (
    <>Project</>
  );
}
