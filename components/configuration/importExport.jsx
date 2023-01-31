import React, { useEffect, useState } from "react";
import { userService } from "../../services";
import {
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import ImportData from "./importExport/importData";


const ImportExport = (props) => {
  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      setPageAuthorized(true);
    }

  }, []);
  
  return (


    <div>
      {isPageAuthprized ? (
          <Card variant="settingCard">
            <CardHeader>
                Import & Export
            </CardHeader>
            <CardBody>
                <ImportData />
            </CardBody>
          </Card>
          
      ) : (
        <> 
        </>
      ) }



      
      </div>

  );
};

export default ImportExport;
