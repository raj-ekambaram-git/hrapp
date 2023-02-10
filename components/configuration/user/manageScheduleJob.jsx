import React, { useEffect, useState } from "react";
import { userService } from "../../../services";
import {
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import ManageJobs from "../jobs/manageJobs";




const ManageScheduleJob = (props) => {

  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() || (userService.isAccountAdmin() && userService.isScheduleJobAdmin())) {
      setPageAuthorized(true);
    }
  }, []);
  

  return (


    <div>
      {isPageAuthprized?<>
        <Card variant="userSettingCard">
            <CardHeader>
                Manage Schedule Job
            </CardHeader>
            <CardBody>      
              <ManageJobs />
            </CardBody>
          </Card>
      </>:<></>}
      </div>

  );
};

export default ManageScheduleJob;
