import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, configurationService, userService } from "../../services";
import {
  HStack,
  Button,
  Box,
  Flex,
  Heading,
  Badge
} from '@chakra-ui/react'
import { PageMainHeader } from "../common/pageMainHeader";
import { setSelectedVendorId } from "../../store/modules/Vendor/actions";
import { useDispatch } from "react-redux";

import { ConfigConstants, EMPTY_STRING } from "../../constants";
import { CustomTable } from "../customTable/Table";
import { util } from "../../helpers";
import AddEditConfigAdmin from "./addEditConfigAdmin";


const ConfigAdminList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const ADMIN_CONFIG_LIST_TABLE_COLUMNS = React.useMemo(() => ConfigConstants.CONFOG_ADMIN_LIST_TABLE_META)
  const [configAdminList, setConfigAdminList] = useState([]);
  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() ) {
      setPageAuthorized(true);
      getConfigAdminList();
    }

  }, []);
  
  function handleConfigEdit(adminConfigId) {

  }
    /**
   * Function to get the list of accounts for a drop down
   */
    async function getConfigAdminList() {
      // setPageAuthorized(true);
      const responseData = await configurationService.getAdminConfigList();
      if(responseData != undefined && responseData != EMPTY_STRING) {
        const adminConfigList =  responseData.map((adminConfig, index)=> {
          adminConfig.detailAction = <Button size="xs" bgColor="header_actions" onClick={() => handleConfigEdit(adminConfig.id)}>Edit</Button>
          adminConfig.createdDate = util.getFormattedDate(vendor.createdDate)
          return adminConfig;
        });
        setConfigAdminList(adminConfigList );
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
              <CustomTable columns={ADMIN_CONFIG_LIST_TABLE_COLUMNS} rows={configAdminList} />
          </div>
      ) : (
        <> 
        </>
      ) }



      
      </div>

  );
};

export default ConfigAdminList;
