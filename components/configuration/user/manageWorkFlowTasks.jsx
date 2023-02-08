import React, { useEffect, useState } from "react";
import { userService } from "../../../services";
import {
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import ManageTasks from "../../workFlow/manageTasks";



const ManageWorkFlowTasks = (props) => {

  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      setPageAuthorized(true);
    }
  }, []);
  

  return (


    <div>
      {isPageAuthprized?<>
        <Card variant="userSettingCard">
            <CardHeader>
                Manage WorkFlow Tasks
            </CardHeader>
            <CardBody>      
              <ManageTasks/>          
            </CardBody>
          </Card>
      </>:<></>}
      </div>

  );
};

export default ManageWorkFlowTasks;
