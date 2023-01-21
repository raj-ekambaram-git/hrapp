import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { configurationService, userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react'
import { PageMainHeader } from "../common/pageMainHeader";
import { useDispatch } from "react-redux";

import { ConfigConstants, EMPTY_STRING } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";
import AddEditConfigAdmin from "./addEditConfigAdmin";


const ConfigAdminList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const ADMIN_APP_CONFIG_LIST_TABLE_COLUMNS = React.useMemo(() => ConfigConstants.CONFOG_APP_ADMIN_LIST_TABLE_META)
  const [appConfigAdminList, setAppConfigAdminList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() ) {
      setPageAuthorized(true);
      getConfigAdminList();
    }

  }, []);
  
  function handleConfigEdit(configAdminId) {

  }
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getConfigAdminList() {
      // setPageAuthorized(true);
      const responseData = await configurationService.getAdminAppConfigList();
      if(responseData != undefined && responseData != EMPTY_STRING) {
        const adminConfigList =  responseData.map((appConfig, index)=> {
          appConfig.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleConfigEdit(adminConfig.id)}>Edit</Button>
          appConfig.createdDate = util.getFormattedDate(vendor.createdDate)
          return appConfig;
        });
        setAppConfigAdminList(appConfig );
      }
      

  }
  

  return (


    <div>
      {isPageAuthprized ? (
        <div>
              <PageMainHeader heading="Admin Configuraitons"/>    
              <Flex marginBottom="1rem">
                <HStack>
                  <Box>
                    <AddEditConfigAdmin/>
                  </Box>
                </HStack>
              </Flex>
              <CustomTable columns={ADMIN_APP_CONFIG_LIST_TABLE_COLUMNS} rows={appConfigAdminList} />
          </div>
      ) : (
        <> 
        </>
      ) }



      
      </div>

  );
};

export default ConfigAdminList;
